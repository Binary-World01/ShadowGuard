import base64
import os

b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
data = base64.b64decode(b64)

os.makedirs('public/assets', exist_ok=True)
for name in ['icon128.png', 'icon48.png', 'icon16.png', 'icon16_alert.png', 'icon48_alert.png']:
    with open(f'public/assets/{name}', 'wb') as f:
        f.write(data)
print("Icons created.")
