# LienLibre Proguard Rules
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# Kotlinx Serialization
-keepclassmembers class * {
    *** Companion;
}
-keepclasseswithmembers class * {
    kotlinx.serialization.KSerializer serializer(...);
}

# Material 3 & Jetpack Compose
-keep class androidx.compose.material3.** { *; }
