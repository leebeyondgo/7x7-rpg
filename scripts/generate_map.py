import csv
import math
import random

SIZE = 400
ICE_BORDER = 10
CENTER = SIZE // 2
MAX_RADIUS = 150
NUM_ANGLES = 360
random.seed(42)

# Generate random radius values for each angle to create irregular coastline
angle_radii = [random.uniform(MAX_RADIUS * 0.8, MAX_RADIUS * 1.2) for _ in range(NUM_ANGLES)]

def radius_at(theta):
    # theta in radians [0, 2*pi)
    fraction = theta / (2 * math.pi)
    idx = int(fraction * NUM_ANGLES) % NUM_ANGLES
    return angle_radii[idx]

terrains = ['jungle', 'forest', 'grassland', 'desert']

with open('public/maps/world.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    for i in range(SIZE):
        row = []
        for j in range(SIZE):
            if i < ICE_BORDER or i >= SIZE - ICE_BORDER or j < ICE_BORDER or j >= SIZE - ICE_BORDER:
                row.append('ice')
                continue
            dx = i - CENTER
            dy = j - CENTER
            dist = math.sqrt(dx * dx + dy * dy)
            theta = math.atan2(dy, dx) % (2 * math.pi)
            boundary = radius_at(theta)
            if dist < boundary:
                # assign terrain based on normalized distance
                norm = dist / boundary
                if norm < 0.25:
                    terrain = terrains[0]
                elif norm < 0.5:
                    terrain = terrains[1]
                elif norm < 0.75:
                    terrain = terrains[2]
                else:
                    terrain = terrains[3]
                row.append(terrain)
            else:
                row.append('ocean')
        writer.writerow(row)
