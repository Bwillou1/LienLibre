import Foundation
import SwiftUI
import AtollExtensionKit

/// Représente l'état d'activité dynamique émis par LienLibre vers l'encoche Atoll (Dynamic Island)
public struct LienLibreActivityAttributes: ActivityAttributes, Codable {
    public struct ContentState: Codable, Hashable {
        public var title: String
        public var subtitle: String
        public var score: Int
        public var status: String // "analyzing", "verified", "blocked", "alert"
        public var generatedUrl: String?
        public var timestamp: Date

        public init(
            title: String,
            subtitle: String,
            score: Int,
            status: String,
            generatedUrl: String? = nil,
            timestamp: Date = Date()
        ) {
            self.title = title
            self.subtitle = subtitle
            self.score = score
            self.status = status
            self.generatedUrl = generatedUrl
            self.timestamp = timestamp
        }
    }

    public var sessionID: String

    public init(sessionID: String) {
        self.sessionID = sessionID
    }
}

/// Définition de l'interface Dynamic Island (Atoll Notch Widget)
public struct LienLibreActivityWidget: Widget {
    public let kind: String = "LienLibreActivityWidget"

    public init() {}

    public var body: some WidgetConfiguration {
        ActivityConfiguration(for: LienLibreActivityAttributes.self) { context in
            // Vue Verrouillée / Lock Screen
            LienLibreLockScreenView(state: context.state)
                .liquidGlass(variant: .frostedGlow)
        } dynamicIsland: { context in
            DynamicIsland {
                // Vue Étendue (Expanded Island)
                DynamicIslandExpandedRegion(.leading) {
                    HStack(spacing: 8) {
                        Image(systemName: iconForStatus(context.state.status))
                            .foregroundColor(colorForStatus(context.state.status))
                            .font(.title2)
                        VStack(alignment: .leading) {
                            Text(context.state.title)
                                .font(.headline)
                                .foregroundColor(.white)
                            Text("Mini-Bot Sentinel")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing) {
                        Text("\(context.state.score)/100")
                            .font(.system(.title3, design: .rounded, weight: .bold))
                            .foregroundColor(scoreColor(context.state.score))
                        Text(context.state.status.uppercased())
                            .font(.system(size: 9, weight: .heavy))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(colorForStatus(context.state.status).opacity(0.25))
                            .cornerRadius(6)
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(context.state.subtitle)
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.9))
                            .lineLimit(2)

                        if let link = context.state.generatedUrl, !link.isEmpty {
                            HStack {
                                Image(systemName: "link.circle.fill")
                                    .foregroundColor(.cyan)
                                Text(link)
                                    .font(.caption)
                                    .lineLimit(1)
                                    .truncationMode(.middle)
                                    .foregroundColor(.cyan)
                            }
                            .padding(6)
                            .background(Color.white.opacity(0.1))
                            .cornerRadius(8)
                        }
                    }
                    .padding(.top, 4)
                }
            } compactLeading: {
                Image(systemName: iconForStatus(context.state.status))
                    .foregroundColor(colorForStatus(context.state.status))
            } compactTrailing: {
                Text("\(context.state.score)")
                    .font(.caption2.bold())
                    .foregroundColor(scoreColor(context.state.score))
            } minimal: {
                Image(systemName: "shield.checkerboard")
                    .foregroundColor(.cyan)
            }
        }
    }

    private func iconForStatus(_ status: String) -> String {
        switch status {
        case "verified": return "checkmark.seal.fill"
        case "blocked": return "nosign"
        case "alert": return "exclamationmark.triangle.fill"
        default: return "waveform.path.ecg"
        }
    }

    private func colorForStatus(_ status: String) -> Color {
        switch status {
        case "verified": return .green
        case "blocked": return .red
        case "alert": return .orange
        default: return .cyan
        }
    }

    private func scoreColor(_ score: Int) -> Color {
        if score >= 75 { return .green }
        if score >= 50 { return .orange }
        return .red
    }
}

public struct LienLibreLockScreenView: View {
    public let state: LienLibreActivityAttributes.ContentState

    public init(state: LienLibreActivityAttributes.ContentState) {
        self.state = state
    }

    public var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "shield.lefthalf.filled")
                .font(.title)
                .foregroundColor(.cyan)
            VStack(alignment: .leading) {
                Text(state.title)
                    .font(.headline)
                Text(state.subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Text("\(state.score)")
                .font(.title2.bold())
                .foregroundColor(.green)
        }
        .padding()
    }
}
