// DatabaseLoader.js - Coordinated database initialization
// Extracted from Utils.js during Phase 1B refactor

import {ItemsDatabase} from '../data/ItemsDatabase.js';
import {SpellsDatabase} from '../data/SpellsDatabase.js';
import {HarvestablesDatabase} from '../data/HarvestablesDatabase.js';
import {MobsDatabase} from '../data/MobsDatabase.js';
import zonesDatabase from '../data/ZonesDatabase.js';
import {CATEGORIES} from '../constants/LoggerConstants.js';

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 300;
const MAX_RETRY_DELAY_MS = 2000;

// Global database state tracking
window.databasesReady = false;
window.databaseLoadingProgress = {
    items: false,
    spells: false,
    harvestables: false,
    mobs: false,
    zones: false
};

/**
 * Appends a per-attempt cache-buster to the asset path.
 *
 * Every attempt must produce a distinct URL: a Chromium cache entry that was
 * stored from a `200 + ETag` response can later answer a conditional request
 * with a bodiless 304, and if that cached body is no longer usable the fetch
 * resolves "ok" while `response.json()` fails. Because the retries reused the
 * exact same URL they kept hitting the same broken cache entry, so a single
 * flaky load turned into a hard "Failed to load Mobs database" until a manual
 * reload. A unique query string per attempt forces a fresh 200 every time.
 */
function bustedPath(path, attempt) {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}_retry=${attempt}-${Date.now()}`;
}

async function loadDatabaseWithRetry(database, path, name, ...extraArgs) {
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
        try {
            await database.load(bustedPath(path, retryCount), ...extraArgs);
            window.logger?.debug(CATEGORIES.SYSTEM, `${name}Loaded`, {});
            return {success: true, database};
        } catch (error) {
            retryCount++;
            const isLastAttempt = retryCount >= MAX_RETRIES;

            window.logger?.error(CATEGORIES.SYSTEM, `${name}LoadFailed`, {
                error: error.message,
                attempt: retryCount,
                maxRetries: MAX_RETRIES,
                isLastAttempt
            });

            if (isLastAttempt) {
                return {success: false, error, name};
            }

            // Exponential backoff with jitter (300ms, 600ms, 1200ms, 2000ms)
            const backoff = Math.min(
                MAX_RETRY_DELAY_MS,
                BASE_RETRY_DELAY_MS * Math.pow(2, retryCount - 1)
            );
            await new Promise(resolve => setTimeout(resolve, backoff + Math.random() * 200));
        }
    }
}

function showDatabaseError(databaseName, error) {
    if (window.toast) {
        window.toast.error(`Failed to load ${databaseName} database`);
    }

    // Also create a DOM notification for persistent visibility
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="error-content">
            <h3>Database Loading Failed</h3>
            <p>Unable to load <strong>${databaseName}</strong> database.</p>
            <p class="error-details">${error.message}</p>
            <div class="error-actions">
                <button onclick="location.reload()">Reload Page</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()">
                    Continue Anyway
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
}

export function isLoaded() {
    return window.databasesReady === true;
}

export async function load() {
    // Skip if already loaded (cached from previous radar visit)
    if (window.databasesReady &&
        window.itemsDatabase &&
        window.spellsDatabase &&
        window.harvestablesDatabase &&
        window.mobsDatabase) {
        window.logger?.info(CATEGORIES.SYSTEM, 'DatabasesCached', {});
        return;
    }

    window.logger?.info(CATEGORIES.SYSTEM, 'LoadingStart', {});

    const itemsDatabase = new ItemsDatabase();
    const spellsDatabase = new SpellsDatabase();
    const harvestablesDatabase = new HarvestablesDatabase();
    const mobsDatabase = new MobsDatabase();

    const promises = [
        loadDatabaseWithRetry(itemsDatabase, '/ao-bin-dumps/items.min.json', 'Items')
            .then(result => {
                if (result.success) {
                    window.databaseLoadingProgress.items = true;
                    window.itemsDatabase = result.database;
                }
                return result;
            }),

        loadDatabaseWithRetry(spellsDatabase, '/ao-bin-dumps/spells.min.json', 'Spells')
            .then(result => {
                if (result.success) {
                    window.databaseLoadingProgress.spells = true;
                    window.spellsDatabase = result.database;
                }
                return result;
            }),

        loadDatabaseWithRetry(harvestablesDatabase, '/ao-bin-dumps/harvestables.min.json', 'Harvestables')
            .then(result => {
                if (result.success) {
                    window.databaseLoadingProgress.harvestables = true;
                    window.harvestablesDatabase = result.database;
                }
                return result;
            }),

        loadDatabaseWithRetry(mobsDatabase, '/ao-bin-dumps/mobs.min.json', 'Mobs')
            .then(result => {
                if (result.success) {
                    window.databaseLoadingProgress.mobs = true;
                    window.mobsDatabase = result.database;
                }
                return result;
            }),

        loadDatabaseWithRetry(zonesDatabase, '/ao-bin-dumps/zones.json', 'Zones')
            .then(result => {
                if (result.success) {
                    window.databaseLoadingProgress.zones = true;
                    window.zonesDatabase = zonesDatabase;
                }
                return result;
            })
    ];

    const results = await Promise.all(promises);

    // Check for failures
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
        failures.forEach(failure => {
            showDatabaseError(failure.name, failure.error);
        });
    }

    // Mark as ready even if some databases failed (graceful degradation)
    window.databasesReady = true;

    const successCount = results.filter(r => r.success).length;
    window.logger?.info(CATEGORIES.SYSTEM, 'LoadingComplete', {
        success: successCount,
        failed: failures.length
    });

    // Dispatch custom event for components that need to wait for databases
    window.dispatchEvent(new CustomEvent('databasesReady', {
        detail: {
            successCount,
            failures: failures.map(f => f.name)
        }
    }));
}
