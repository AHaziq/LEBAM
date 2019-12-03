import { Component, ViewChild, Renderer, OnInit } from '@angular/core';
import { NavController, Content, ToastController, LoadingController } from 'ionic-angular';
import { HttpProvider } from '../providers/http/http.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  @ViewChild('imageCanvas') canvas: any;
  canvasElement: any;

  saveX: number;
  saveY: number;

  @ViewChild(Content) content: Content;

  selectedColor = '#9e2956';
  brushSize: number = 5;

  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3'];

  report
  imagePath
  images = [];
  message: string = "";

  constructor(public navCtrl: NavController,
    public renderer: Renderer,
    public httpServices: HttpProvider,
    public toastController: ToastController,
    public loadCtrl: LoadingController) {
  }

  ngOnInit() {
    this.httpServices.getStudent().subscribe(async resp => {
      this.report = resp["data"]
      console.log('Get Student =', this.report)
    }, async err => {
      console.log('error: ', err);
    });
  }

  ionViewDidEnter() {
    this.canvasElement = this.canvas.nativeElement;
    let ctx = this.canvasElement.getContext('2d');
    var cw = this.canvasElement.width = window.innerWidth;
    var ch = this.canvasElement.height = 425;
    const img = new Image()
    img.src = "../assets/image/body.jpg"
    img.onload = () => {
      ctx.drawImage(img, (cw - img.width) / 2, (ch - img.height) / 2);
    }
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  changeSize(size) {
    this.brushSize = size;
  }

  startDrawing(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX - canvasPosition.x;
    let currentY = ev.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = this.brushSize;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  saveCanvasImage(msj) {
    let load = this.loadCtrl.create({
      content: 'Please Wait'
    });
    load.present();

    var dataUrl = this.canvasElement.toDataURL();

    var data = dataUrl.split(',')[1];
    this.images.push(data)

    let saveObj = { report_picture: this.images, message: msj, type_id: 10 };
    console.log('fizikal =', saveObj)

    this.httpServices.uploadPic(saveObj).subscribe(async resp => {
      console.log('Success =', resp)
      load.dismiss();
      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.ionViewDidEnter();
      this.message = ""
      let toast = await this.toastController.create({ message: "Image saved", duration: 2000 })
      toast.present()
    }, async err => {
      load.dismiss();
      let toast = await this.toastController.create({ message: "Failed save image", duration: 2000 })
      toast.present()
      console.log('error: ', err);
    });
  }

  async clearCanvasImage() {
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.ionViewDidEnter();
    let toast = await this.toastController.create({ message: "Clear image", duration: 2000 })
    toast.present()
  }

}