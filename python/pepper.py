import time
from flask import Flask
from flask_cors import CORS
from qibullet import SimulationManager


app = Flask(__name__)
CORS(app)

simulation_manager = SimulationManager()
client_id = simulation_manager.launchSimulation(gui=True)

# Spawning a virtual Pepper robot, at the origin of the WORLD frame, and a
# ground plane
pepper = simulation_manager.spawnPepper(
    client_id, translation=[0, 0, 0], quaternion=[0, 0, 0, 1], spawn_ground_plane=True
)

robot = pepper

@app.route("/LWave")
def LWave():
    robot.setAngles(
        [
            "LShoulderPitch",
            "LShoulderRoll",
            "LElbowRoll",
            "LElbowYaw",
            "LWristYaw",
            "LHand",
        ],
        [0.4, 0.0, -1.0, -1.5, 1.25, 1.0],
        [1.0] * 6,
    )

    for i in range(3):
        robot.setAngles("LElbowYaw", -2.0, 0.4)
        time.sleep(0.2)
        robot.setAngles("LElbowYaw", -1.25, 0.4)
        time.sleep(0.2)

    robot.setAngles("LElbowYaw", -1.5, 0.4)
    time.sleep(0.5)
    Stand(robot, 0.5)

    return 'success'


@app.route("/RWave")
def RWave():
    robot.setAngles(
        [
            "RShoulderPitch",
            "RShoulderRoll",
            "RElbowRoll",
            "RElbowYaw",
            "RWristYaw",
            "RHand",
        ],
        [0.4, 0.0, 1.0, 1.5, -1.25, 1.0],
        [1.0] * 6,
    )

    for i in range(3):
        robot.setAngles("RElbowYaw", 2.0, 0.4)
        time.sleep(0.2)
        robot.setAngles("RElbowYaw", 1.25, 0.4)
        time.sleep(0.2)

    robot.setAngles("RElbowYaw", 1.5, 0.4)
    time.sleep(0.5)
    Stand(robot, 0.5)

    return 'success'


@app.route("/LAsk")
def LAsk():
    robot.setAngles(
        [
            "LShoulderPitch",
            "LShoulderRoll",
            "LElbowRoll",
            "LElbowYaw",
            "LWristYaw",
            "HipPitch",
            "HeadPitch",
        ],
        [0.1, 0.2, -0.6, -1.5, -0.9, -0.4, -0.5],
        [0.35, 0.35, 0.35, 0.35, 0.35, 0.2, 0.3],
    )

    time.sleep(0.6)
    Stand(pepper, 0.3)
    time.sleep(1.0)

    return 'success'


@app.route("/RAsk")
def RAsk():
    robot.setAngles(
        [
            "RShoulderPitch",
            "RShoulderRoll",
            "RElbowRoll",
            "RElbowYaw",
            "RWristYaw",
            "HipPitch",
            "HeadPitch",
        ],
        [0.1, -0.2, 0.6, 1.5, 0.9, -0.4, -0.5],
        [0.35, 0.35, 0.35, 0.35, 0.35, 0.2, 0.3],
    )

    time.sleep(0.6)
    Stand(pepper, 0.3)
    time.sleep(1.0)

    return 'success'


@app.route("/LRAsk")
def LRAsk():
    robot.setAngles(
        [
            "LShoulderPitch",
            "LShoulderRoll",
            "LElbowRoll",
            "LElbowYaw",
            "LWristYaw",
            "HipPitch",
            "HeadPitch",
        ],
        [0.1, 0.2, -0.6, -1.5, -0.9, -0.4, -0.5],
        [0.7, 0.7, 0.7, 0.7, 0.7, 0.4, 0.6],
    )

    robot.setAngles(
        [
            "RShoulderPitch",
            "RShoulderRoll",
            "RElbowRoll",
            "RElbowYaw",
            "RWristYaw",
            "HipPitch",
            "HeadPitch",
        ],
        [0.1, -0.2, 0.6, 1.5, 0.9, -0.4, -0.5],
        [0.7, 0.7, 0.7, 0.7, 0.7, 0.4, 0.6],
    )

    time.sleep(0.6)
    Stand(pepper)
    time.sleep(1.0)

    return 'success'


def Stand(robot, speed=1.0):
    robot.goToPosture("Stand", speed)


if __name__ == "__main__":
    Stand(pepper)
    pepper.moveTo(0.0, 0.0, -0.7)

    try:
        # while True:
        #   LWave(pepper)
        #   RWave(pepper)
        #   LAsk(pepper)
        #   RAsk(pepper)
        #   LRAsk(pepper)
        app.run(debug=True)

    except KeyboardInterrupt:
        simulation_manager.stopSimulation(client_id)
