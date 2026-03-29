import type { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions } from "../types";


export const fighterProps = {
    speed: 200,
    direction: null,
    isDead: false,
    isCooldownActive: false,
    maxHp: 10,
    previousHp: 10,

}

export function setFighterControls(
    k: KaboomCtx,
    fighter: GameObj,
    keys: {
        LEFT: string;
        RIGHT: string;
        UP: string;
        DOWN: string
    }
) {
    const onKeyDownController = k.onKeyDown(
        (key) => {
            if (fighter.curAnim() === "attack") return;

            switch (key) {
                case keys.LEFT:
                    fighter.flipX = true;
                    fighter.move(-fighter.speed, 0);
                    fighter.directions = Directions.LEFT;
                    if (fighter.curAnim !== "run" && fighter.curAnim !== "jump") {
                        fighter.play("run");
                    }
                    break;

                case keys.RIGHT:
                    fighter.flipX = false;
                    fighter.move(fighter.speed, 0);
                    fighter.directions = Directions.RIGHT;
                    if (fighter.curAnim !== "run" && fighter.curAnim !== "jump") {
                        fighter.play("run");
                    }
                    break;
                default:
            }
        }
    );

    const onKeyReleaseController = k.onKeyRelease((key) => {
        if ((key === keys.LEFT || key === keys.RIGHT)
            && fighter.curAnim !== "idle"
            && fighter.curAnim !== "attack")
            fighter.play("idle");
    });

    const onKeyPressController = k.onKeyPress((key) => {
        if (
            key === keys.UP &&
            fighter.isGrounded() &&
            fighter.curAnim !== "jump"
        ) {
            fighter.jump();
            fighter.play("jump");
            return;
        }

        if (key === keys.DOWN && !fighter.isCooldownActive) {
            fighter.isCooldownActive = true;
            k.wait(0.7, () => (fighter.isCooldownActive = false));

            const updateHitboxPos = () => {
                const hitboxPos: { [key: string]: Vec2 } = {
                    LEFT: k.vec2(fighter.pos.x - 50, fighter.pos.y),
                    RIGHT: k.vec2(fighter.pos.x + 50, fighter.pos.y),
                };

                return hitboxPos[fighter.direction];
            };

            const attackHitbox = k.add([
                k.area({ shape: new k.Rect(k.vec2(0), 50, 50) }),
                k.anchor("center"),
                k.pos(updateHitboxPos()),
            ]);

            const attackUpdateController = k.onUpdate(() => {
                attackHitbox.pos = updateHitboxPos();

            });


            const enemyTag = fighter.is("samurai") ? "ninja" : "samurai";

            attackHitbox.onCollide(enemyTag, (enemy) => {
                k.wait(0.1, () => (enemy.previousHp = enemy.hp()));
                if (enemy.hp() !== 0) enemy.hurt(1);
            });

            if (fighter.curAnim !== "attack") fighter.play("attack");

            k.wait(0.3, () => {
                k.destroy(attackHitbox);
                attackUpdateController.cancel();
            });

        }
    });

    fighter.on("hurt", () => {
        if (fighter.hp() > 0 && fighter.curAnim !== "hit") {
            fighter.play("hit")
            return;
        }

        if (fighter.curAnim() !== "death" && fighter.hp() === 0) {
            fighter.isDead = true;
            onKeyDownController.cancel();
            onKeyReleaseController.cancel();
            onKeyPressController.cancel();
            fighter.play("death");

            const enemyTag = fighter.is("samurai") ? "ninja" : "samurai";
            const enemy = k.get(enemyTag, { recursive: true })[0];

            const enemyStatus = k.add([
                k.text("WINNER", {
                    size: 16,
                }),
                k.area(),
                k.anchor("center"),
                k.pos(),
            ]);

            const fighterStatus = k.add([
                k.text("LOSER", {
                    size: 16,
                }),
                k.area(),
                k.anchor("center"),
                k.pos(),
            ]);

            k.onUpdate(() => {
                enemyStatus.pos = k.vec2(enemy.pos.x, enemy.pos.y - 40);
                if (fighter.is("ninja") && fighter.isDead) {
                    fighterStatus.pos = k.vec2(fighter.pos.x - 25, fighter.pos.y - 5);
                    return;
                }
                fighterStatus.pos = k.vec2(fighter.pos.x, fighter.pos.y - 40);
            });

            k.wait(5, () => k.go("arena"));

        }
    })

    k.onUpdate(() => {
        if (
            !fighter.isJumping() &&
            !fighter.isGrounded() &&
            fighter.curAnim() !== "fall" &&
            fighter.curAnim() !== "attack"
        ) {
            fighter.play("fall");
            return;
        }

        if (fighter.curAnim() === "fall" && fighter.isGrounded()) {
            fighter.play("idle")
            return;
        }

        if (
            fighter.curAnim() !== "idle" &&
            fighter.curAnim() !== "jump" &&
            fighter.curAnim() !== "attack" &&
            fighter.curAnim() !== "hit" &&
            fighter.curAnim() !== "fall" &&
            fighter.curAnim() !== "run" &&
            !fighter.isDead
        ) {
            fighter.play("idle")
        }
    });

}