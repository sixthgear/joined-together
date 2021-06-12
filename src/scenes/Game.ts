import Phaser from 'phaser';
import Misty from "../objects/Misty";
import IdleState from '../states/IdleState';
import BaseState from '../states/BaseState';

export default class Demo extends Phaser.Scene {

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys|null = null;
  private misty: Misty|null = null;


  constructor() {
    super('GameScene');
  }
  preload() {
    this.load.image('sky','assets/sky_gradient.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/test-map.json');
    this.load.image('base_tiles', 'assets/tiles_sheet.png');
    this.load.spritesheet('misty', 'assets/run_animation.png', {frameWidth: 100, frameHeight: 150});
    this.load.spritesheet('misty_stand', 'assets/misty_testanim.png', {frameWidth: 100, frameHeight: 150});
  }
  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    this.misty =  new Misty(this, 200, 7700, 'misty_stand');

    // add to this scene
    this.add.existing(this.misty);

    // add to physics engine
    this.physics.add.existing(this.misty);

    // create the Tilemap
    const map = this.make.tilemap({ key: 'tilemap' })

    // add the tileset image we are using
    const tileset = map.addTilesetImage('tiles_sheet', 'base_tiles')
    const layer = map.createLayer('Tile Layer 1', tileset);
    layer.setCollisionByExclusion([-1], true);

    this.physics.add.collider(this.misty, layer);

    this.misty.movementState = new IdleState(this.misty);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setScroll(0, 10000);
    this.cameras.main.startFollow(this.misty);

    // var cursors = this.input.keyboard.createCursorKeys();
    this.cursors = this.input.keyboard.createCursorKeys();

    //this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('misty', { start: 0, end: 6 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('misty', { start: 0, end: 6 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'misty_stand', frame: 0 } ],
      frameRate: 20
    });

  }

  update(time: number, delta: number) {

    if(!this.misty || !this.cursors) {
      return;
    }

    const nextState = this.misty.movementState!.update(this.cursors);
    if (nextState) {
      console.log(this.misty.movementState);
      this.misty.movementState = nextState;
    }

  }
}