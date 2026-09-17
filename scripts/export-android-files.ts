import * as fs from 'fs';
import * as path from 'path';
import { ANDROID_PROJECT_FILES } from '../src/data/androidProjectFiles';

function writeFile(relPath: string, content: string) {
  const fullPath = path.resolve(process.cwd(), relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`Created: ${relPath}`);
}

// 1. Write all Android files from ANDROID_PROJECT_FILES
for (const file of ANDROID_PROJECT_FILES) {
  writeFile(file.path, file.code);
}

// 2. Write root Gradle files
writeFile(
  'settings.gradle.kts',
  `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "AndroDock"
include(":app")
`
);

writeFile(
  'build.gradle.kts',
  `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
);

writeFile(
  'gradle.properties',
  `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
);

writeFile(
  'gradle/wrapper/gradle-wrapper.properties',
  `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
);

writeFile(
  'gradle/libs.versions.toml',
  `[versions]
agp = "8.6.0"
kotlin = "2.0.20"
coreKtx = "1.13.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`
);

// 3. App Proguard & Res Files
writeFile(
  'app/proguard-rules.pro',
  `# ProGuard rules for AndroDock
-keep class com.pixel8.iosdock.** { *; }
-dontwarn androidx.glance.**
`
);

writeFile(
  'app/src/main/res/values/strings.xml',
  `<resources>
    <string name="app_name">Pixel 8 iOS Dock</string>
    <string name="widget_name">iOS Dock (ودجت النظام)</string>
    <string name="widget_description">ودجت الشاشة الرئيسية المدمج بنظام أندرويد لفتح التطبيقات بتصميم زجاجي فاخر</string>
</resources>
`
);

writeFile(
  'app/src/main/res/values/colors.xml',
  `<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>
`
);

writeFile(
  'app/src/main/res/values/themes.xml',
  `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.Pixel8IOSDock" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
    </style>
</resources>
`
);

writeFile(
  'app/src/main/res/xml/backup_rules.xml',
  `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
</full-backup-content>
`
);

writeFile(
  'app/src/main/res/xml/data_extraction_rules.xml',
  `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="root" />
    </cloud-backup>
    <device-transfer>
        <include domain="root" />
    </device-transfer>
</data-extraction-rules>
`
);

writeFile(
  'app/src/main/res/drawable/widget_preview.xml',
  `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="280dp"
    android:height="72dp"
    android:viewportWidth="280"
    android:viewportHeight="72">
    <path
        android:fillColor="#330F172A"
        android:pathData="M26,0 L254,0 A26,26 0 0,1 280,26 L280,46 A26,26 0 0,1 254,72 L26,72 A26,26 0 0,1 0,46 L0,26 A26,26 0 0,1 26,0 Z" />
</vector>
`
);

writeFile(
  'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/widget_dock_glass_bg" />
    <foreground android:drawable="@drawable/widget_preview" />
</adaptive-icon>
`
);

writeFile(
  'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
  `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/widget_dock_glass_bg" />
    <foreground android:drawable="@drawable/widget_preview" />
</adaptive-icon>
`
);

// 4. Create gradlew and gradlew.bat
writeFile(
  'gradlew',
  `#!/bin/sh
#
# Copyright 2015 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

exec gradle "$@"
`
);

fs.chmodSync(path.resolve(process.cwd(), 'gradlew'), 0o755);

console.log('Finished writing all Android files successfully!');
