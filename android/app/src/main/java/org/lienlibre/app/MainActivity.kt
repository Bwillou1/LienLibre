package org.lienlibre.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import org.lienlibre.app.ai.OnDeviceAiEngine
import org.lienlibre.app.ui.components.LienLibreBottomBar
import org.lienlibre.app.ui.components.Screen
import org.lienlibre.app.ui.screens.AlertsScreen
import org.lienlibre.app.ui.screens.EreaderScreen
import org.lienlibre.app.ui.screens.HomeScreen
import org.lienlibre.app.ui.screens.OfflineMeshScreen
import org.lienlibre.app.ui.theme.LienLibreTheme

class MainActivity : ComponentActivity() {

    private lateinit var aiEngine: OnDeviceAiEngine
    private var sharedUrlState = mutableStateOf("")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        aiEngine = OnDeviceAiEngine(applicationContext)
        handleIncomingIntent(intent)

        setContent {
            LienLibreTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Home.route

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        LienLibreBottomBar(
                            currentRoute = currentRoute,
                            onNavigate = { route ->
                                navController.navigate(route) {
                                    popUpTo(Screen.Home.route) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Home.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(Screen.Home.route) {
                            HomeScreen(
                                initialSharedUrl = sharedUrlState.value,
                                aiEngine = aiEngine,
                                onNavigateToEreader = { pin ->
                                    navController.navigate(Screen.Ereader.route)
                                },
                                onNavigateToMesh = { data ->
                                    navController.navigate(Screen.Mesh.route)
                                }
                            )
                        }
                        composable(Screen.Alerts.route) {
                            AlertsScreen()
                        }
                        composable(Screen.Ereader.route) {
                            EreaderScreen()
                        }
                        composable(Screen.Mesh.route) {
                            OfflineMeshScreen(initialData = sharedUrlState.value)
                        }
                    }
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIncomingIntent(intent)
    }

    private fun handleIncomingIntent(intent: Intent?) {
        if (intent == null) return

        when (intent.action) {
            Intent.ACTION_SEND -> {
                if (intent.type == "text/plain") {
                    val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT) ?: ""
                    extractAndSetUrl(sharedText)
                }
            }
            Intent.ACTION_VIEW -> {
                val dataUri = intent.data
                if (dataUri != null) {
                    val urlParam = dataUri.getQueryParameter("url") ?: dataUri.toString()
                    extractAndSetUrl(urlParam)
                }
            }
        }
    }

    private fun extractAndSetUrl(text: String) {
        val urlRegex = Regex("""https?://[^\s]+""")
        val match = urlRegex.find(text)
        val extracted = match?.value ?: text.trim()
        if (extracted.startsWith("http://") || extracted.startsWith("https://")) {
            sharedUrlState.value = extracted
        }
    }
}
