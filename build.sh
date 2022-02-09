#!/bin/bash
#echo "Linux cannot compile the iOS version of the app, so this script will only build the Android APK."

if [[ "$OSTYPE" =~ ^darwin ]]; then
	echo "Creating Android APK build..."
	flutter build apk
	if [ "$?" -ne "0" ]; then
          echo "Error with flutter apk build!"
          exit 1
	fi
	
	echo "Creating iOS build..."
	flutter build ios
	if [ "$?" -ne "0" ]; then
          echo "Error with flutter iOS build!"
          exit 1
	fi
fi

if [[ "$OSTYPE" =~ ^mysys ]]; then
	echo "iOS build only supported on macOS! ONLY the Android build will be created!"
        flutter build apk
        if [ "$?" -ne "0" ]; then
          echo "Error with flutter apk build!"
          exit 1
        fi
fi

if [[ "$OSTYPE" =~ ^linux ]]; then
	echo "iOS build only supported on macOS! ONLY the Android build will be created!"
        flutter build apk
        if [ "$?" -ne "0" ]; then
          echo "Error with flutter apk build!"
          exit 1
        fi
fi

echo "Build(s) finished without errors."
exit 0
