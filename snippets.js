const snippets = {
  lua: {
    "Custom Note Event": 
`function onCustomNoteHit(id, direction, noteType, isSustainNote)
  -- Your custom Lua code here
end`,

    "Spawn Sprite": 
`makeLuaSprite('sprite', 'image', 100, 200)
addLuaSprite('sprite', true)`,

    "Play Sound": 
`playSound('hitSound', 1)`,

    "Tween Example": 
`doTweenX('moveTween', 'sprite', 500, 2, 'linear')`
  },

  haxe: {
    "New Character Class": 
`class PlayerCharacter extends Character {
  public function new() {
    super();
  }
}`,

    "Custom Event": 
`function onEvent(name:String, value1:String, value2:String) {
  trace('Event: $name')
}`,

    "Tween Example": 
`FlxTween.tween(sprite, { x: 500 }, 2, { ease: FlxEase.linear })`,

    "Animation Play": 
`sprite.animation.play('dance')`
  }
};