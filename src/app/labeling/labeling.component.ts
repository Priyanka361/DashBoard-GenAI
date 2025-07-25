import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-labeling',
  templateUrl: './labeling.component.html',
  styleUrls: ['./labeling.component.scss']
})
export class LabelingComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('image', { static: true }) imageRef!: ElementRef<HTMLImageElement>;

  orderId = '';
  status = '';
  comment = '';
  imageSrc: string = '';
  uploadedImageSrc: string = '';
  labelList = ['Person', 'Car', 'Animal', 'Tree'];
  isEditable = false;
  isShowLabelDropdown = false;

  selectedLabel = '';
  newImageFile: File | null = null;
  ctx!: CanvasRenderingContext2D;
  isDrawing = false;
  boxes: { x: number; y: number; w: number; h: number; label: string }[] = [];
  startX = 0;
  startY = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.status = params['status'];
      this.comment = params['comment'];
      this.imageSrc = params['image'];
      this.isEditable = ['Pending', 'In Progress'].includes(this.status);
      this.isShowLabelDropdown = ['Pending', 'In Progress'].includes(this.status);
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.syncCanvasWithImage();
  }

  syncCanvasWithImage() {
    const img = this.imageRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      this.drawBoxes();
    };
  }

  startDraw(event: MouseEvent) {
    if (!this.isEditable) return;

    this.isDrawing = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const width = mouseX - this.startX;
    const height = mouseY - this.startY;

    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.drawBoxes();

    this.ctx.strokeStyle = 'red';
    this.ctx.strokeRect(this.startX, this.startY, width, height);
  }

  endDraw(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const endX = event.clientX - rect.left;
    const endY = event.clientY - rect.top;

    const w = endX - this.startX;
    const h = endY - this.startY;

    if (w && h && this.selectedLabel) {
      this.boxes.push({ x: this.startX, y: this.startY, w, h, label: this.selectedLabel });
      this.drawBoxes();
    }
  }

  drawBoxes() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.boxes.forEach(box => {
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 5;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.fillStyle = 'green';
      ctx.font = '35px Arial';
      ctx.fillText(box.label, box.x + 4, box.y + 34);
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveLabeling() {
    console.log('Saved Boxes:', this.boxes);
    alert('Labels saved (fake API)');
  }

  cancel() {
    this.boxes = [];
    this.drawBoxes();
  }
}
