/**

 Downloads Overwrite Already Existing Files (I need a better name)
 v0.0.3 Zach Adams - zach@zach-adams.com

 Source Code originally from Chromium extension API doc examples:
 https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/downloads/downloads_overwrite

 "Forked" from Downloads Overwrite Existing Files:
 https://chrome.google.com/webstore/detail/downloads-overwrite-exist/fkomnceojfhfkgjgcijfahmgeljomcfk

 Potential Future Features:
 - Whitelist/Blacklist for sites to auto-overwrite files from
 - Customizable "uniqueness" patterns (instead of file (1), file (2),
    etc. we could do file-1, file-2, etc.)
 - Turn off overwrite downloads from showing in history

 "Perhaps it's impossible to wear an identity without becoming what
 you pretend to be."
    ~ Orson Scott Card, Ender's Game

 ####################################################################
 OVERVIEW:
 ####################################################################

 https://developer.chrome.com/extensions/downloads#event-onDeterminingFilename
 https://developer.chrome.com/extensions/downloads#type-FilenameConflictAction

 If you look at the original source for this code, it's almost exactly
 the same. However there's a bug so when the extension is enabled it
 will always show the default downloads directory and will never
 remember where you were downloading to previously.

 The "suggest" function takes an object with the following parameters:

 - {string} filename - The DownloadItem's new target
 DownloadItem.filename, as a path relative to the user's default
 Downloads directory, possibly containing subdirectories. Absolute
 paths, empty paths, and paths containing back-references ".." will be
 ignored.
 - (optional) {FilenameConflictAction (Enum)} conflictAction - The
 action to take if filename already exists.

 The key to this extension is passing 'overwrite' as the
 conflictAction parameter to the suggest function. The problem is that
 suggest needs the filename parameter set to something as it's not
 optional. The original extension passes it the DownloadItem's
 filename, which makes sense. However the DownloadItem's filename is
 (for some reason) set to the default downloads directory, and setting
 it breaks Chrome "remembering" where your last download directory
 was.

 The fix is passing a simple back-reference string as the filename, as
 in the docs it states "Absolute paths, empty paths, and paths
 containing back-references ".." will be ignored.". This way the
 function still runs and sets 'overwrite' as the conflictAction, but
 now we're not breaking the Chrome folder remembering feature.

**/

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	suggest({filename: '..', conflictAction: 'overwrite'});
});