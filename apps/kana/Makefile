install:
	bun install

start:
	REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 npx expo start -c

# ? Build app

# * Build for android .aab (Play Store)
build_android_aab_google:
	mkdir -p dist
	eas build --platform android --profile production_google --local --output dist/app_google_store.aab

# * Build for android .aab (RuStore)
build_android_aab_rustore:
	mkdir -p dist
	eas build --platform android --profile production_rustore --local --output dist/app_rustore.aab

# * Build for android .aab (Huawei AppGallery)
build_android_aab_huawei:
	mkdir -p dist
	eas build --platform android --profile production_huawei --local --output dist/app_huawei.aab

# * Build for android .apk ( for testing )
build_android_apk:
	mkdir -p dist
	eas build --platform android --profile production_apk --local --output dist/app.apk

# * Development Build for android (.apk)
build_android_dev:
	mkdir -p dist
	eas build --platform android --profile development --local --output dist/dev_app.apk

# * Build for iOS
build_ios:
	mkdir -p dist
	eas build --platform ios --profile production_ios --local --output dist/app.ipa

# ? Submission to App Stores

eas_submit_ios:
	eas submit --platform ios

# ? Working with ADB (Android Debug Bridge)

ANDROID_PACKAGE = pro.khvat.learnjapanese
ADB = adb $(if $(DEVICE),-s $(DEVICE),)

# * List connected Android devices
devices:
	adb devices

# * Install the built .apk on a connected Android device
# Usage: make install_android_apk
#        make install_android_apk DEVICE=38301FDJH00JKB
install_android_apk:
	$(ADB) uninstall $(ANDROID_PACKAGE) || true
	$(ADB) install dist/app.apk

# * Install the development .apk on a connected Android device
# Usage: make install_android_dev
#        make install_android_dev DEVICE=38301FDJH00JKB
install_android_dev:
	$(ADB) uninstall $(ANDROID_PACKAGE) || true
	$(ADB) install dist/dev_app.apk

uninstall_android:
	$(ADB) uninstall $(ANDROID_PACKAGE) || true
