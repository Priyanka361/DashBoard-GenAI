import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-labeling',
  templateUrl: './labeling.component.html',
  styleUrls: ['./labeling.component.scss']
})
export class LabelingComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('image', { static: true }) imageRef!: ElementRef<HTMLImageElement>;

  orderId = '';
  status = '';
  comment = '';
  accuracy = '';
  label = '';
  images: string[] = []; // Multiple images
  currentImageIndex = 0;
  labelList = ['Person', 'Car', 'Animal', 'Tree'];
  isEditable = false;
  isShowLabelDropdown = false;
  showLabelWarning = false;

  selectedLabel = '';
  ctx!: CanvasRenderingContext2D;
  isDrawing = false;
  boxes: { [key: number]: { x: number; y: number; w: number; h: number; label: string }[] } = {}; // store per image
  startX = 0;
  startY = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.status = params['status'];
      this.comment = params['comment'];
      this.accuracy = params['accuracy'];
      this.label = params['label'];
      // Convert single or multiple images (comma-separated) into an array
      const imageParam = params['image'];
      this.images = imageParam ? (Array.isArray(imageParam) ? imageParam : imageParam.split(',')) : [];

      this.isEditable = ['Pending', 'In Progress'].includes(this.status);
      this.isShowLabelDropdown = ['In Progress'].includes(this.status);

      // Initialize empty boxes for each image
      this.images.forEach((_, index) => (this.boxes[index] = []));
    });
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resizeCanvas();

    const img = this.imageRef.nativeElement;
    img.onload = () => this.resizeCanvas();

    if (img.complete) {
      this.resizeCanvas();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const img = this.imageRef.nativeElement;
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    this.drawBoxes();
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.drawBoxes();
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.drawBoxes();
    }
  }

  startDraw(event: MouseEvent) {
    if (!this.isEditable) return;

    if (!this.selectedLabel) {
      this.showLabelWarning = true;
      return;
    }

    this.showLabelWarning = false;
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

    this.ctx.strokeStyle = 'green';
    this.ctx.lineWidth = 3;
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
      this.boxes[this.currentImageIndex].push({
        x: this.startX,
        y: this.startY,
        w,
        h,
        label: this.selectedLabel
      });
      this.drawBoxes();
    }
  }

  drawBoxes() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.boxes[this.currentImageIndex]?.forEach(box => {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 5;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.fillStyle = 'red';
      ctx.font = '14px Arial';
      ctx.fillText(box.label, box.x + 4, box.y - 4);
    });
  }

saveLabeling() {
  const currentBoxes = this.boxes[this.currentImageIndex] || [];

  // If no new labels drawn, use the original label from query params
  const labelsToSend = currentBoxes.length > 0
    ? currentBoxes
    : this.label
      ? [{ label: this.label, x: 0, y: 0, w: 0, h: 0 }] // Mock position if old label exists
      : [];

  const payload = {
    image: this.images[this.currentImageIndex],
    labels: labelsToSend
  };

  console.log('Payload for current image:', payload);
 if (currentBoxes.length === 0 && this.label) {
    alert(`No new labels drawn. Sending previous label for image ${this.currentImageIndex + 1}.`);
  } else {
    alert(`Labels saved successfully for image ${this.currentImageIndex + 1} (mock)`);
  }

  if (this.currentImageIndex === this.images.length - 1) {
    const fullPayload = this.images.map((image, index) => ({
      image,
      labels:
        this.boxes[index]?.length > 0
          ? this.boxes[index]
          : this.label
          ? [{ label: this.label, x: 0, y: 0, w: 0, h: 0 }]
          : []
    }));

    console.log('Submitting all images with labels:', fullPayload);
    alert('All images processed and submitted (mock)');
  }
}



  cancel() {
    this.boxes[this.currentImageIndex] = [];
    this.drawBoxes();
  }
}
