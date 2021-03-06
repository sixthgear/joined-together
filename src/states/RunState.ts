import BaseState, { StateReturn } from './BaseState';
import { Direction } from '../Objects/Misty';
import IdleState from './IdleState';
import JumpState from "./JumpState";
import FallState from './FallState';
import { KeyDict, KeyMap } from '../types';

export default class RunState extends BaseState {

    name = 'run';
    direction: Direction|null = null;

    enter(params: { direction: Direction }) {
        this.sprite.anims.play('misty_run', true);
        this.direction = params.direction;
        this.sprite.setFlip(this.direction == Direction.Left, false);
    }

    exit() {
        // this.sprite.particles.sparks.emitters.first.stop();
    }

    update(delta: number, controls: KeyMap): StateReturn|void {

        if (!this.sprite.body.onFloor()) {
            return { type: FallState , params: { graceJump: true }}
        } else if (controls.jumpJustPressed) {
            if (controls.down) {
                return { type: FallState, params: { fallThru: true }};
            } else {
                return { type: JumpState };
            }
        } else if (!controls.right && !controls.left) {
            return { type: IdleState };
        } else if (controls.left && !controls.right && this.direction !== Direction.Left) {
            return {type: RunState, params: { direction: Direction.Left }};
        } else if (controls.right && !controls.left && this.direction !== Direction.Right) {
            return { type: RunState, params: { direction: Direction.Right }};
        } else if (this.direction == Direction.Left && this.sprite.body.velocity.x > 0) {
            this.sprite.anims.play('misty_fall', true);
            this.sprite.particles.poofs.emitters.first.start();
        } else if (this.direction == Direction.Right && this.sprite.body.velocity.x < 0) {
            this.sprite.anims.play('misty_fall', true);
            this.sprite.particles.poofs.emitters.first.start();
        } else {
            this.sprite.anims.play('misty_run', true);
            this.sprite.particles.poofs.emitters.first.stop();
        }

        if (this.direction != null) {
            this.sprite.updateVelocityX(this.direction);
        }

    }
}