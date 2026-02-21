stop :
cd ~/Project/arena/algorithmic-arena

# Stop all containers (keeps data)
docker compose stop

# Stop and remove containers (keeps data in volumes)
docker compose down

# Stop, remove containers AND delete data
docker compose down -v

# Stop, remove containers, delete data AND images
docker compose down -v --rmi all


run:
restart after stopping -
# If you used 'stop'
docker compose start

# If you used 'down'
docker compose up -d

new-
# Start (use existing images)
docker compose up -d

# Start and rebuild if code changed
docker compose up -d --build

# Start and force rebuild everything
docker compose up -d --build --force-recreate

# Start with logs visible
docker compose up