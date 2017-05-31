# vid2mp3
Extension for chrome-based browsers to get mp3s from video sites, supported by youtube-dl

### Notice:
It's just for fun.
Feel free to edit/improve in testing branch.
I use this on my arch linux system.
You have to edit the paths in the host.ini and manifest.json files to fit your environment

### Dependencies:
python-notify2 python-pytaglib ffmpeg youtube-dl

### Install Host:

#### Opera:
host file loation:
~/.config/opera/NativeMessagingHosts/com.company.app
host manifest location:
/etc/opt/chrome/native-messaging-hosts/com.company.app.json

### Vivaldi:
host file loation:
~/.config/vivaldi/NativeMessagingHosts/com.company.app
host manifest location:
~/.config/vivaldi/NativeMessagingHosts/com.company.app.json

### Chromium:
host file loation:
~/.config/chromium/NativeMessagingHosts/com.company.app
host manifest location:
~/.config/chromium/NativeMessagingHosts/com.company.app.json

### Install Extension
edit path to host in manifest.json and "load unpacked extensions" in chrome://extensions (opera://extensions)  

test2Sp
