package org.lienlibre.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.QrCode2
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import org.lienlibre.app.ui.theme.CyanPrimary

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Home : Screen("home", "Générateur", Icons.Default.ElectricBolt)
    object Alerts : Screen("alerts", "Alertes", Icons.Default.NotificationsActive)
    object Ereader : Screen("ereader", "Liseuse", Icons.Default.MenuBook)
    object Mesh : Screen("mesh", "TXQR / Mesh", Icons.Default.QrCode2)
}

@Composable
fun LienLibreBottomBar(
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    val items = listOf(
        Screen.Home,
        Screen.Alerts,
        Screen.Ereader,
        Screen.Mesh
    )

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        contentColor = MaterialTheme.colorScheme.onSurface
    ) {
        items.forEach { screen ->
            val selected = currentRoute == screen.route
            NavigationBarItem(
                selected = selected,
                onClick = { onNavigate(screen.route) },
                icon = { Icon(screen.icon, contentDescription = screen.title) },
                label = { Text(screen.title) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = CyanPrimary,
                    selectedTextColor = CyanPrimary,
                    indicatorColor = MaterialTheme.colorScheme.surfaceVariant
                )
            )
        }
    }
}
