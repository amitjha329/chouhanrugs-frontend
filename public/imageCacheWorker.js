self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request) // Check cache first
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`Serving from cache: ${event.request.url}`);
          return cachedResponse; // Return cached response if found
        }

        console.log(`Fetching from network: ${event.request.url}`);
        return fetch(event.request) // Fetch from network if not cached
          .then((response) => {
            // Update the cache with the new response (optional but recommended)
            if (response.ok) {
                return caches.open('image-cache')
                .then(cache => {
                    cache.put(event.request, response.clone()); // Clone to avoid consuming the body
                    return response;
                })

            }
            return response
          });
      })
  );
});

self.addEventListener('message', async (event) => {
    const { images } = event.data;

    if (images && Array.isArray(images)) {
        const cache = await caches.open('image-cache');

        for (const imageUrl of images) {
            try {
                // Check if already cached before fetching (Improvement)
                if(!(await cache.match(imageUrl))) {
                    const response = await fetch(imageUrl);
                    if (response.ok) {
                        await cache.put(imageUrl, response.clone()); // Clone to avoid consuming the body

                        self.postMessage({ status: 'success', imageUrl });
                    } else {
                        self.postMessage({ status: 'error', imageUrl, error: 'Failed to fetch' });
                    }
                } else {
                    self.postMessage({status: 'cached', imageUrl});
                }

            } catch (error) {
                self.postMessage({ status: 'error', imageUrl, error: error.message });
            }
        }
    }
});

