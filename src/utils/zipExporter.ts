import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export async function exportAndroidStudioProject(): Promise<void> {
  const zip = new JSZip();

  // Root project files
  zip.file(
    'README.md',
    `# Pixel 8 iOS Dock & Android System AppWidget
مشروع أندرويد متكامل بلغة Kotlin و Jetpack Compose مبني خصيصاً لهواتف Google Pixel 8 (Android 14 & 15).

## الخيارات المتاحة في المشروع:
1. **Android System AppWidget (ودجت النظام المدمج)**:
   - مبني بأحدث تقنية رسمية من Google: **Jetpack Glance for AppWidgets**.
   - مدمج مباشرة في لانشر Pixel 8 كودجت شاشة رئيسية عادي.
   - لا يتطلب أي أذونات خاصة، وصفر استهلاك للبطارية في الخلفية.
   - قابل للتكبير/التصغير (4x1 أو 5x1) مع لمسات زجاجية iOS Frosted Glass.

2. **Overlay Window & Foreground Service (وضع الطفو العائم)**:
   - يطفو فوق جميع التطبيقات باستمرار عبر WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY.
   - مزامنة 120Hz وفيزياء نوابض سلسة جداً.

3. **Android Native System Taskbar (طريقة النظام بدون كود)**:
   - تفعيل شريط مهام أندرويد اللوحي المخفي في Pixel 8 عبر خيارات المطورين (Smallest width = 600dp).

## كيفية الفتح في Android Studio:
1. قم بفك ضغط هذا المجلد.
2. افتح Android Studio واختر "Open an Existing Project".
3. اختر المجلد المفكوك وانتظر مزامنة Gradle Sync.
4. قم بتشغيل التطبيق على هاتف Pixel 8 أو محاكي أندرويد 14+.
`
  );

  // Add all files
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(file.path, file.code);
  }

  // Add placeholder res files for complete Android Studio compilation
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">Pixel 8 iOS Dock</string>
    <string name="widget_name">iOS Dock (ودجت النظام)</string>
    <string name="widget_description">ودجت الشاشة الرئيسية المدمج بنظام أندرويد لفتح التطبيقات بتصميم زجاجي فاخر</string>
</resources>`
  );

  zip.file(
    'app/src/main/res/values/themes.xml',
    `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.Pixel8IOSDock" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
    </style>
</resources>`
  );

  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
  );

  zip.file(
    '.gitignore',
    `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties`
  );

  zip.file(
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
include(":app")`
  );

  // Generate ZIP blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pixel8_iOS_Floating_Dock_AndroidStudio.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
