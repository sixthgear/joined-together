import BaseState, { StateReturn } from './BaseState';
import Misty, { Direction } from '../Objects/Misty';
import JumpState from "./JumpState";
import FallState from './FallState';
import RunState from './RunState';

export default class IdleState extends BaseState {

    name = 'idle';

    enter() {
        // this.sprite.body.setVelocityX(0);
        this.sprite.anims.play('misty_idle', true);
        this.sprite.hasDoubleJump = true;
    }

    update(): StateReturn|void {

        const controls = this.getControls();

        if (!this.sprite.body.onFloor()) {
            return { type: FallState , params: { graceJump: true }}
        } if (controls.jumpJustPressed) {
            if (controls.down) {
                return { type: FallState, params: { fallThru: true }};
            } else {
                return { type: JumpState };
            }
        } else if (controls.left) {
            return { type: RunState, params: { direction: Direction.Left }};
        } else if (controls.right) {
            return { type: RunState, params: { direction: Direction.Right }};
        }

        // screeeeech
        if (this.sprite.body.velocity.x != 0) {
            this.sprite.body.velocity.x *= this.sprite.dampenVelocity.ground;
        }
    }
}