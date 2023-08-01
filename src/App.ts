export class App {
  board: Board
  keypad: Keypad
  user: User
  constructor() {
    this.board = new Board(this)
    this.user = new User(this)
    this.keypad = new Keypad(this)
  }

  onMouseMove(evt: MouseEvent) {
    this.board.onMouseMove(evt)
    this.board.sail(evt.movementX, evt.movementY)
    this.user.moveImage()
    this.user.moveNote()
    this.user.resizeNote()
  }

  onMouseLeave() {
    this.board.sailing = false
    if (this.keypad.imageActive) {
      this.keypad.imageActive.moving = false
    }
    if (this.keypad.noteActive) {
      this.keypad.noteActive.resizing = false
      this.keypad.noteActive.moving = false
    }
    this.keypad.imageActive = undefined
    this.keypad.noteActive = undefined
  }

  onMouseDown(evt: MouseEvent) {

    if (evt.button == 2) {
      this.board.sailing = true
    }
  }


  onMouseUp(evt: MouseEvent) {
    if (evt.button == 0) {
      if (this.keypad.imageActive) {
        this.keypad.imageActive.moving = false
      }
      if (this.keypad.noteActive) {
        this.keypad.noteActive.resizing = false
        this.keypad.noteActive.moving = false
      }
    }
    if (evt.button == 2) {
      this.board.sailing = false
    }
    this.keypad.imageActive = undefined
    this.keypad.noteActive = undefined
  }
}

export class Keypad {
  app: App
  images: Image[]
  imageActive?: Image
  notes: Note[]
  noteActive?: Note
  constructor(app: App) {
    this.app = app
    this.notes = []
    this.images = []
  }

  addNote(a?:any) {
    let newNote = new Note()
    newNote.bgcolor = this.app.user.lastColorNote
    newNote.textWeight = this.app.user.lastTextWeight
    newNote.textSize = this.app.user.lastTextSize
    newNote.textAlignament = this.app.user.lastTextAlignament
    if(a){
      newNote.setNote(a)
    }
    this.noteActive = newNote
    this.notes.push(newNote)
    this.fixZindex()
  }

  addImage(a?:any) {
    let newImage = new Image()
    if(a){
      newImage.setImage(a)
    }
    this.imageActive = newImage
    this.images.push(newImage)
    this.fixZindex()
  }

  fixZindex(){
    debugger
    let papers: any
    papers = [...this.images]
    papers.push(...this.notes)
    
    if (this.imageActive) {
      this.imageActive.zIndex = Math.max(...papers.map((a: any) => a.zIndex)) + 1
    }

    if (this.noteActive) {
      this.noteActive.zIndex = Math.max(...papers.map((a: any) => a.zIndex)) + 1
    }
  }

  export() {    
    var textoJSON = JSON.stringify({
      notes:this.app.keypad.notes,
      images:this.app.keypad.images,
    })
    var elemento = document.createElement('a');
    var archivoJSON = new Blob([textoJSON], { type: 'application/json' });
    elemento.href = URL.createObjectURL(archivoJSON);
    elemento.download = "Proyecta Notas - " + new Date().toDateString() + " " + new Date().toTimeString()
    elemento.click()
    // localStorage.setItem('lsNotes', JSON.stringify(this.app.keypad.notes))
    // localStorage.setItem('lsImages', JSON.stringify(this.app.keypad.images))
  }

  importar() {
    var input = <any>document.getElementById('inputArchivo');
    input.click()
  }

  onchange() {
    var input = <any>document.getElementById('inputArchivo');
    if (input.files && input.files[0]) {
      var archivo = input.files[0]
      var lector = new FileReader()
      lector.onload = (e: any) => {
        this.app.keypad.notes.splice(0)
        this.app.keypad.images.splice(0)
        var contenidoArchivo = e.target.result
        let jsonImport = JSON.parse(contenidoArchivo)
        jsonImport.notes.forEach((a: any) => { this.app.keypad.addNote(a) })
        jsonImport.images.forEach((a: any) => { this.app.keypad.addImage(a) })
        input.files = undefined
        input.value = ''
      }
      lector.readAsText(archivo);
    }
  }
}

export class Board {
  app: App
  maxHeight: number
  maxWidth: number
  sailing: boolean
  constructor(app: App) {
    this.app = app
    this.maxHeight = 3500
    this.maxWidth = 5500
    this.sailing = false
  }

  onMouseMove(evt: MouseEvent) {
    this.app.user.pageX = evt.pageX
    this.app.user.pageY = evt.pageY
    this.app.user.moveX = evt.movementX
    this.app.user.moveY = evt.movementY
  }

  onKeyDown(evt: KeyboardEvent) {
    if (!(
      (evt.key == 'F5') ||
      (evt.key == 'F12') ||
      (evt.ctrlKey && evt.key == 'v') ||
      (evt.ctrlKey && evt.key == 'F5')
    ))
      evt.preventDefault()
  }

  onPaste(evt: ClipboardEvent) {
    evt.preventDefault()
    const clipboardData = evt.clipboardData
    
    if (!clipboardData || !clipboardData.items) {
      return
    }

    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.indexOf('image') !== -1) {
        const reader = new FileReader()
        const file = item.getAsFile()
        reader.onloadend = () => {
          const base64String = reader.result?.toString()
          if (base64String != null) {
            const newImage = new Image()
            newImage.base64 = base64String
            this.app.keypad.images.push(newImage)
          }
        }
        if (file != null)
          reader.readAsDataURL(file)
      }
      if (item.type.indexOf('text') !== -1) {
        this.app.keypad.addNote({text:clipboardData.getData('text/plain').toString()})
        break
      }
    }
  }


  sail(movX: number, movY: number) {
    if (this.sailing) {
      scrollBy({ behavior: "instant", left: movX * 5, top: movY * 5 })
    }
  }
}


export class User {
  app: App
  pageX: number
  pageY: number
  moveX: number
  moveY: number
  lastTextAlignament: number
  lastTextWeight: number
  lastTextSize: number
  lastColorNote: string
  constructor(app: App) {
    this.app = app
    this.pageX = 0
    this.pageY = 0
    this.moveX = 0
    this.moveY = 0
    this.lastColorNote = 'hsl(60 20% 30%)'
    this.lastTextAlignament = 0
    this.lastTextWeight = 400
    this.lastTextSize = 30
  }
  moveImage() {
    if (this.app.keypad.imageActive && this.app.keypad.imageActive.moving) {
      this.app.keypad.imageActive.left = this.pageX - 20,
        this.app.keypad.imageActive.top = this.pageY - 20

      if (this.app.keypad.imageActive.left < 100)
        this.app.keypad.imageActive.left = 100
      if (this.app.keypad.imageActive.top < 100)
        this.app.keypad.imageActive.top = 100

      if (this.app.keypad.imageActive.width) {
        if (this.app.keypad.imageActive.left > this.app.board.maxWidth + 150 - this.app.keypad.imageActive.width)
          this.app.keypad.imageActive.left = this.app.board.maxWidth + 150 - this.app.keypad.imageActive.width
        if (this.app.keypad.imageActive.top > this.app.board.maxHeight + 200 - this.app.keypad.imageActive.width)
          this.app.keypad.imageActive.top = this.app.board.maxHeight + 200 - this.app.keypad.imageActive.width
      }
    }
  }

  moveNote() {
    if (this.app.keypad.noteActive && this.app.keypad.noteActive.moving) {
      this.app.keypad.noteActive.left = this.pageX - 20,
        this.app.keypad.noteActive.top = this.pageY - 20

      if (this.app.keypad.noteActive.left < 100)
        this.app.keypad.noteActive.left = 100
      if (this.app.keypad.noteActive.top < 100)
        this.app.keypad.noteActive.top = 100

      if (this.app.keypad.noteActive.width) {
        if (this.app.keypad.noteActive.left > this.app.board.maxWidth + 150 - this.app.keypad.noteActive.width)
          this.app.keypad.noteActive.left = this.app.board.maxWidth + 150 - this.app.keypad.noteActive.width
        if (this.app.keypad.noteActive.top > this.app.board.maxHeight + 200 - this.app.keypad.noteActive.width)
          this.app.keypad.noteActive.top = this.app.board.maxHeight + 200 - this.app.keypad.noteActive.width
      }
    }
  }

  resizeNote() {
    if (this.app.keypad.noteActive && this.app.keypad.noteActive.resizing) {
      this.app.keypad.noteActive.width += this.moveX
      this.app.keypad.noteActive.height += this.moveY

      if (this.app.keypad.noteActive.height < 0)
        this.app.keypad.noteActive.height = 0
      if (this.app.keypad.noteActive.width < 120)
        this.app.keypad.noteActive.width = 120
    }
  }
}



export class Image {
  base64: string
  id: string
  moving: boolean
  pinned: boolean
  top: number
  left: number
  width: number
  zIndex: number
  constructor() {
    this.base64 = ''
    this.id = new Date().toISOString()
    this.left = scrollX + 100
    this.top = scrollY + 100
    this.moving = false
    this.pinned = false
    this.width = 400
    this.zIndex = 0
  }
  setImage(image:any){
    this.base64 = image.base64 ? image.base64 : this.base64
    this.id = image.id ? image.id : this.id
    this.left = image.left ? image.left : this.left 
    this.top = image.top ? image.top : this.top
    this.width = image.width ? image.width : this.width
    this.zIndex = image.zIndex ? image.zIndex : this.zIndex
    this.pinned = image.pinned ? image.pinned : this.pinned
  }
  delete(stack: any[]) {
    stack.splice(stack.findIndex(i => i.id == this.id), 1)
  }
}


export class Note {
  top: number
  left: number
  width: number
  height: number
  textWeight: number
  textSize: number
  textAlignament: number
  zIndex: number

  moving: boolean
  pinned: boolean
  resizing: boolean

  text: string
  id: string
  bgcolor: string

  constructor() {
    this.width = 250
    this.height = 100
    this.left = scrollX + innerWidth / 2 - this.width / 2
    this.top = scrollY + innerHeight / 2 - this.height / 2
    this.textWeight = 400
    this.textSize = 30
    this.textAlignament = 0
    this.zIndex = 0
    this.moving = false
    this.pinned = false
    this.resizing = false
    this.id = new Date().toISOString()
    this.text = ''
    this.bgcolor = 'hsl(60 20% 30%)'
  }
  setNote(a?: any) {
    this.width = a.width? a.width : this.width
    this.height = a.height? a.height : this.height
    this.left = a.left? a.left : this.left 
    this.top = a.top? a.top : this.top 
    this.textWeight = a.textWeight? a.textWeight : this.textWeight
    this.textSize = a.textSize? a.textSize : this.textSize
    this.textAlignament = a.textAlignament? a.textAlignament : this.textAlignament 
    this.zIndex = a.zIndex? a.zIndex : this.zIndex 
    this.pinned = a.pinned? a.pinned : this.pinned
    this.id = a.id? a.id : this.id
    this.text = a.text? a.text : this.text
    this.bgcolor = a.bgcolor? a.bgcolor : this.bgcolor
  }
  delete(stack: any[]) {
    stack.splice(stack.findIndex(i => i.id == this.id), 1)
  }
  changeColor(user: any) {
    if (this.bgcolor == 'hsl(60 20% 30%)') {
      this.bgcolor = 'hsl(120 20% 30%)'
      user.lastColorNote = this.bgcolor
      return
    }
    if (this.bgcolor == 'hsl(120 20% 30%)') {
      this.bgcolor = 'hsl(180 20% 30%)'
      user.lastColorNote = this.bgcolor
      return
    }
    if (this.bgcolor == 'hsl(180 20% 30%)') {
      this.bgcolor = 'hsl(240 20% 30%)'
      user.lastColorNote = this.bgcolor
      return
    }
    if (this.bgcolor == 'hsl(240 20% 30%)') {
      this.bgcolor = 'hsl(300 20% 30%)'
      user.lastColorNote = this.bgcolor
      return
    }
    if (this.bgcolor == 'hsl(300 20% 30%)') {
      this.bgcolor = 'hsl(0 20% 30%)'
      user.lastColorNote = this.bgcolor
      return
    }
    if (this.bgcolor == 'hsl(0 20% 30%)') {
      this.bgcolor = 'hsl(60 20% 30%)'
      user.lastColorNote = this.bgcolor
      return
    }
  }

  changeTextWeight(user:any) {
    if (this.textWeight == 400) {
      this.textWeight = 600
      user.lastTextWeight = this.textWeight
      return
    }
    if (this.textWeight == 600) {
      this.textWeight = 800
      user.lastTextWeight = this.textWeight
      return
    }
    if (this.textWeight == 800) {
      this.textWeight = 400
      user.lastTextWeight = this.textWeight
      return
    }
  }

  changeTextSize(user:any) {
    if (this.textSize == 30) {
      this.textSize = 40
      user.lastTextSize = this.textSize
      return
    }
    if (this.textSize == 40) {
      this.textSize = 60
      user.lastTextSize = this.textSize
      return
    }
    if (this.textSize == 60) {
      this.textSize = 70
      user.lastTextSize = this.textSize
      return
    }
    if (this.textSize == 70) {
      this.textSize = 80
      user.lastTextSize = this.textSize
      return
    }
    if (this.textSize == 80) {
      this.textSize = 30
      user.lastTextSize = this.textSize
      return
    }
  }

  changeTextAlignament(user:any) {
    if (this.textAlignament == 0) {
      this.textAlignament = 1
      user.lastTextAlignament = this.textAlignament
      return
    }
    if (this.textAlignament == 1) {
      this.textAlignament = 2
      user.lastTextAlignament = this.textAlignament
      return
    }
    if (this.textAlignament == 2) {
      this.textAlignament = 0
      user.lastTextAlignament = this.textAlignament
      return
    }
  }
}