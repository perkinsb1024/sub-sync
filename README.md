# Sub-Sync

Sub-Sync is a simple JavaScript web app designed to synchronize and align SRT Subtitle files. It can apply a constant offset, a scaling factor or both to your SRT files. 

## How To Run

First clone this repository, make sure that `port` in `main.js` is not in use on your computer (you can simply change it to a different port if it is), then navigate to this directory in terminal, then `node main.js`. Finally, point your browser to `localhost:8888` (or whichever port you specified in `main.js`)

Now you can select an SRT file from your computer. Choose either "Constant Offset" or "Linear Scaling", and put the current timestamp that a particular subtitle appears in the field(s) on the left, and the time you want that particular subtitle to appear in the field(s) on the right. You'll need just a single subtitle to apply a constant offset and two subtitles (preferrably at the beginning and end) to apply a linear scaling.

## Screenshots
![Sub-Sync Main Interface](https://raw.githubusercontent.com/perkinsb1024/sub-sync/master/Screenshots/Main_Interface.png)
_The main interace for Sub-Sync_
