import Phaser from 'phaser';
import Misty from "../Objects/Misty";
import Letter, {LetterTypes} from "../Objects/Letter";
// import City from "../city";

export default class Demo extends Phaser.Scene {

    misty!: Misty;
    letter!: Letter;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('GameScene');
    }

    preload() {
        // map
        this.load.tilemapTiledJSON('city_tilemap', 'assets/maps/city.json');
        // images
        this.load.image('sky','assets/sky_gradient.png');
        this.load.image('base_tiles', 'assets/tiles_sheet.png');
        this.load.spritesheet('misty_run', 'assets/run_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_idle', 'assets/misty_testanim.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_fall', 'assets/fall_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('misty_jump', 'assets/jump_animation.png', {frameWidth: 100, frameHeight: 150});
        this.load.spritesheet('letter', 'assets/letter.png', {frameWidth: 100, frameHeight: 100});
    }

    create() {

        // Keyboard Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Misty
        // TODO: Spawn her at the map's spawn point instead of a hardcoded value
        this.misty = new Misty(this, this.physics.world, this.cursors, 200, 9500, 'misty_idle');

        // letter
        this.letter = new Letter(this, this.physics.world, 300, 9500, 'letter', 1, LetterTypes.love);

        // Load Tilemap
        const city = this.make.tilemap({ key: 'city_tilemap' });

        // add the tileset image we are using
        const tileset = city.addTilesetImage('tiles_sheet', 'base_tiles');

        // load layers

        // 'BG Parallax 1' (image)
        // 'BG Parallax 2' (image)
        // 'BG Parallax 3' (image)
        // 'Background Tiles'
        // 'Foreground Tiles'
        // 'Overlay Tiles'
        // 'Wires'
        // 'Triggers'

        // const bgLayers = [
        //     map.createLayer('BG Parallax 1', tileset),
        //     map.createLayer('BG Parallax 2', tileset),
        //     map.createLayer('BG Parallax 3', tileset),
        // ]
        console.log('Image Layers:');
        console.log(city.images);

        const tileLayers = [
            city.createLayer('Background Tiles', tileset),
            city.createLayer('Foreground Tiles', tileset),
            city.createLayer('Overlay Tiles', tileset),
        ]

        tileLayers[0].setDepth(-1);
        tileLayers[1].setCollisionByExclusion([-1], true);
        // tileLayer3.

        // Misty should collide with the the foreground map layer
        this.physics.add.collider(this.misty, tileLayers[1]);
        this.physics.add.collider(this.letter, this.misty, this.letter.collected, undefined, this);

        // Camera and Physics Bounds
        this.physics.world.setBounds(0, 0, city.widthInPixels, city.heightInPixels);
        this.cameras.main.setBounds(0, 0, city.widthInPixels, city.heightInPixels);
        this.cameras.main.startFollow(this.misty);

        // Starry Background
        const bg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'sky');
        bg.setDepth(-2);
        bg.setScrollFactor(bg.width / (city.widthInPixels * 5), 0.04);

    }

    update(time: number, delta: number) {

        // Update MovementState and respond to state changes
        const nextState = this.misty.movementState!.update();
        if (nextState) {
            console.log(nextState.type.name);
            if (this.misty.movementState != null) {
                this.misty.movementState.exit();
            }
            this.misty.movementState = new nextState.type(this.misty, this.cursors);
            this.misty.movementState.enter(nextState.params || {});
        }
    }
}