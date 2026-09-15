// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "LienLibreAtollExtension",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "LienLibreAtollExtension",
            targets: ["LienLibreAtollExtension"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/ebullioscopic/AtollExtensionKit.git", from: "1.0.0")
    ],
    targets: [
        .target(
            name: "LienLibreAtollExtension",
            dependencies: [
                .product(name: "AtollExtensionKit", package: "AtollExtensionKit")
            ],
            path: "Sources"
        )
    ]
)
