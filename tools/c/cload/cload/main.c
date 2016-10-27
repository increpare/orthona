#include <stdio.h>
#include <stdlib.h>
#include <math.h>

typedef unsigned char uchar;

struct Element {
    uchar x;
    uchar y;
    uchar s;
};

struct Line {
    uchar x1;
    uchar y1;
    uchar x2;
    uchar y2;
    uchar t;
};

struct Page {
    uchar E;
    struct Element* elements;
    uchar L;
    struct Line* lines;
};

int compare4bytes(const uchar* a, const char* b)
{
    return
    a[0] == b[0] &&
    a[1] == b[1] &&
    a[2] == b[2] &&
    a[3] == b[3];
}

void tryReadBytes(FILE* ptr, uchar* buffer, int count){
    size_t loadedBytes = fread(buffer,1,count,ptr);
    if (loadedBytes<count){
        printf("Unexpected EOF.\n");
        exit(1);
    }
}

void freePage(struct Page* page){
    free(page->elements);
    free(page->lines);
    free(page);
}

struct Page* loadPage(char* fileName)
{
    
    uchar buffer[5];
    FILE *ptr;
    
    ptr = fopen(fileName,"rb");
    
    if (ptr==NULL){
        printf("File not found");
        exit(1);
    }
    
    size_t loadedBytes = fread(buffer,1,4,ptr);
    
    if (loadedBytes<4){
        printf("Invalid file format.  File doesn't contain correct starting sequence of bytes (it's too short to contain them!).\n");
        exit(2);
    }
    
    if (compare4bytes(buffer,"Orth")==0){
        printf("Invalid file format.  File doesn't contain correct starting sequence of bytes.\n");
        exit(3);
    }
    
    tryReadBytes(ptr,buffer,1);
    uchar VERSION = buffer[0];
    if (VERSION!=0){
        printf("Invalid file format.  Version number not supported.\n");
        exit(4);
    }
    
    
    tryReadBytes(ptr,buffer,1);
    struct Page* P = malloc(sizeof(struct Page)*1);
    
    P->E = buffer[0];
    P->elements = malloc(sizeof(struct Element)*P->E);
    
    for (int i=0;i<P->E;i++){
        tryReadBytes(ptr,buffer,3);
        struct Element* e = &(P->elements[i]);
        e->x = buffer[0];
        e->y = buffer[1];
        e->s = buffer[2];
    }
    
    tryReadBytes(ptr,buffer,1);
    
    P->L = buffer[0];
    P->lines = malloc(sizeof(struct Line)*P->L);
    
    for (int i=0;i<P->L;i++){
        tryReadBytes(ptr,buffer,5);
        struct Line* l = &(P->lines[i]);
        l->x1 = buffer[0];
        l->y1 = buffer[1];
        l->x2 = buffer[2];
        l->y2 = buffer[3];
        l->t = buffer[4];
    }
    
    fclose(ptr);
    return P;
    
}

void printPage(struct Page* p){
    printf("ELEMENTS:\n");
    for (int i=0;i<p->E;i++){
        struct Element e = p->elements[i];
        printf("\t%d %d %d\n",e.x,e.y,e.s);
    }
    printf("LINES:\n");
    for (int i=0;i<p->L;i++){
        struct Line l = p->lines[i];
        printf("\t%d %d %d %d %D\n",l.x1,l.y1,l.x2,l.y2,l.t);
    }
}

void GetDimensions(struct Page* P, uchar* x_out, uchar* y_out){
    uchar max_x=0;
    uchar max_y=0;
    for (int i=0;i<P->E;i++){
        struct Element e = P->elements[i];
        if (e.x>max_x){
            max_x=e.x;
        }
        if (e.y>max_y){
            max_y=e.y;
        }
    }
    for (int i=0;i<P->L;i++){
        struct Line l = P->lines[i];
        if (l.x1>max_x){
            max_x=l.x1;
        }
        if (l.y1>max_y){
            max_y=l.y1;
        }
        if (l.x2>max_x){
            max_x=l.x2;
        }
        if (l.y2>max_y){
            max_y=l.y2;
        }
    }
    *x_out=max_x;
    *y_out=max_y;
}

const float DOC_CELLSIZE=1.0;
const float DOC_PADDING=0.75;
const float STROKE_WIDTH=0.05;

float tr(uchar coord){
    return DOC_PADDING+coord*DOC_CELLSIZE;
}

const int pentagon[] = {
                0,-1000,
                -951,-309,
                -588,809,
                588,809,
                951,-309
};

const int triangle[] = {
                0,-1000,
                -866,500,
                866,500
};


void drawIcon(FILE* f, float x,float y,uchar icon){
    switch(icon){
        case 0://square - solid
        {
            float s = DOC_CELLSIZE*0.3/1.41;
            fprintf(f, "\t\t<svg:rect stroke-width='%f' x='%f' y='%f' width='%f' height='%f' fill='black' stroke='black' />\n",STROKE_WIDTH,x-s,y-s,2*s,2*s);
            break;
        }
        case 1://place marker - solid
        {
            float r = DOC_CELLSIZE*0.4*0.9;
            fprintf(f, "\t\t<svg:path  stroke-width='%f' fill='black' stroke='black' d='",STROKE_WIDTH);
            fprintf(f, "M %f %f ",x,y+r);
            fprintf(f, "L %f %f ",x-r/2,y);
            fprintf(f, "C %f %f, %f %f, %f %f ",x-r,y-r,x+r,y-r,x+r/2,y);
            fprintf(f, "Z ");
            fprintf(f, "'/>\n");
            break;
        }
        case 2://liquid - drop
        {
            
            float r = DOC_CELLSIZE*0.4*0.9;
            fprintf(f, "\t\t<svg:path  stroke-width='%f' fill='white' stroke='black' d='",STROKE_WIDTH);
            fprintf(f, "M %f %f ",x,y-r);
            fprintf(f, "L %f %f ",x-r/2,y);
            fprintf(f, "C %f %f, %f %f, %f %f ",x-r,y+r,x+r,y+r,x+r/2,y);
            fprintf(f, "Z ");
            fprintf(f, "'/>\n");
            break;
        }
        case 3://circle - outline
        {
            float r = DOC_CELLSIZE*0.3;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='white' stroke='black' />\n",STROKE_WIDTH,x,y,r);
            break;
        }
        case 4://dot
        {
            float r = DOC_CELLSIZE*0.1;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='black' stroke='black' />\n",STROKE_WIDTH,x,y,r);
            break;
        }
        case 5://concentric circles
        {
            float r = DOC_CELLSIZE*0.4;
            float oldR=r;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='white' stroke='black' />\n",STROKE_WIDTH,x,y,r);
            r-=0.333*oldR;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='white' stroke='black' />\n",STROKE_WIDTH,x,y,r);
            r-=0.333*oldR;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='white' stroke='black' />\n",STROKE_WIDTH,x,y,r);
            break;
        }
        case 6://diamond
        {
            float s = DOC_CELLSIZE*0.4;
            fprintf(f, "\t\t<svg:path  stroke-width='%f' fill='white' stroke='black' d='",STROKE_WIDTH);
            fprintf(f, "M %f %f ",x-s,y);
            fprintf(f, "L %f %f ",x,y+s);
            fprintf(f, "L %f %f ",x+s,y);
            fprintf(f, "L %f %f ",x,y-s);
            fprintf(f, "Z ");
            fprintf(f, "'/>\n");
            break;
        }
        case 7://triangle outline
        {
            float s = DOC_CELLSIZE*0.4/1000;
            fprintf(f, "\t\t<svg:path  stroke-width='%f' fill='white' stroke='black' d='",STROKE_WIDTH);
            fprintf(f, "M %f %f ",x+triangle[2*0+0]*s,y+triangle[2*0+1]*s);
            fprintf(f, "L %f %f ",x+triangle[2*2+0]*s,y+triangle[2*2+1]*s);
            fprintf(f, "L %f %f ",x+triangle[2*1+0]*s,y+triangle[2*1+1]*s);
            fprintf(f, "Z ");
            fprintf(f, "'/>\n");
            break;
        }
        case 8://square - outline
        {
            float s = DOC_CELLSIZE*0.4/1.41;
            fprintf(f, "\t\t<svg:rect stroke-width='%f' x='%f' y='%f' width='%f' height='%f' fill='white' stroke='black' />\n",STROKE_WIDTH,x-s,y-s,2*s,2*s);
            break;
        }
        case 9://star
        {
            float s = DOC_CELLSIZE*0.4/1000;
            fprintf(f, "\t\t<svg:path  stroke-width='%f' fill='white' stroke='black' d='",STROKE_WIDTH);
            fprintf(f, "M %f %f ",x+pentagon[2*0+0]*s,y+pentagon[2*0+1]*s);
            fprintf(f, "L %f %f ",x+pentagon[2*2+0]*s,y+pentagon[2*2+1]*s);
            fprintf(f, "L %f %f ",x+pentagon[2*4+0]*s,y+pentagon[2*4+1]*s);
            fprintf(f, "L %f %f ",x+pentagon[2*1+0]*s,y+pentagon[2*1+1]*s);
            fprintf(f, "L %f %f ",x+pentagon[2*3+0]*s,y+pentagon[2*3+1]*s);
            fprintf(f, "Z ");
            fprintf(f, "'/>\n");
            break;
        }
        case 10://clover
        {
            float s = DOC_CELLSIZE*0.2/1.41;
            fprintf(f, "\t\t<svg:path  stroke-width='%f' fill='white' stroke='black' d='",STROKE_WIDTH);
            fprintf(f, "M %f %f ",x-s,y-s);
            fprintf(f, "C %f %f, %f %f, %f %f ",x-2*s,y-3*s,x+2*s,y-3*s,x+s,y-s);
            fprintf(f, "C %f %f, %f %f, %f %f ",x+3*s,y-2*s,x+3*s,y+2*s,x+s,y+s);
            fprintf(f, "C %f %f, %f %f, %f %f ",x+2*s,y+3*s,x-2*s,y+3*s,x-s,y+s);
            fprintf(f, "C %f %f, %f %f, %f %f ",x-3*s,y+2*s,x-3*s,y-2*s,x-s,y-s);
            fprintf(f, "Z ");
            fprintf(f, "'/>\n");
            break;
        }
        case 11://interlocking circles
        {
            float r = DOC_CELLSIZE*0.3;
            x-=r/2;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='white' stroke='transparent' />\n",STROKE_WIDTH,x,y,0.4*DOC_CELLSIZE);
            x+=r;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='white' stroke='transparent' />\n",STROKE_WIDTH,x,y,0.4*DOC_CELLSIZE);
            
            x-=r;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='transparent' stroke='black' />\n",STROKE_WIDTH,x,y,0.4*DOC_CELLSIZE);
            x+=r;
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='transparent' stroke='black' />\n",STROKE_WIDTH,x,y,0.4*DOC_CELLSIZE);
            
            break;
        }
            
        case 12://keyhole
        {
            float r = DOC_CELLSIZE*0.2;
            float s = DOC_CELLSIZE*0.3;
            float t = DOC_CELLSIZE*0.2;
            float a = 0.8*M_PI/4;
            float dy = DOC_CELLSIZE*0.05;
            
            fprintf(f, "\t\t<svg:path  stroke-width='%f' fill='white' stroke='black' d='",STROKE_WIDTH);
            fprintf(f, "A %f %f %f %f %f %f %f ",r,r,);
            
            fprintf(f, "Z ");
            fprintf(f, "'/>\n");
            
            ctx.arc(x,y-r+dy,r,Math.PI/2+a,Math.PI*5/2-a);
            ctx.lineTo(x+t,y+s+dy);
            ctx.lineTo(x-t,y+s+dy);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;
        }
        default:
        {   //circle
            fprintf(f, "\t\t<svg:circle stroke-width='%f' cx='%f' cy='%f' r='%f' fill='white' stroke='black' />\n",STROKE_WIDTH,x,y,0.4*DOC_CELLSIZE);
            break;
        }
    }
}

void printSVG(struct Page* P,char* filename){
    uchar max_x;
    uchar max_y;
    GetDimensions(P,&max_x,&max_y);
    printf("%d %d\n",max_x,max_y);
    var w = max_x+1;
    var h = max_y+1;
    
    float docWidth=w*DOC_CELLSIZE+2*DOC_PADDING;
    float docHeight=h*DOC_CELLSIZE+2*DOC_PADDING;
    
    FILE *f = fopen(filename, "w");
    fprintf(f, "<?xml version='1.0' standalone='yes'?>\n");
    fprintf(f, "<parent xmlns='http://example.org'\n");
    fprintf(f, "\txmlns:svg='http://www.w3.org/2000/svg'>\n");
    fprintf(f, "\t<!-- parent contents here -->\n");
    fprintf(f, "\t<svg:svg width='%fcm' height='%fcm' viewBox='0 0 %f %f' version='1.1'>\n",docWidth,docHeight,docWidth,docHeight);
    for(int i=0;i<P->E;i++){
        struct Element e = P->elements[i];
        float ex = tr(e.x);
        float ey = tr(e.y);
        drawIcon(f,ex,ey,e.s);
    }
    fprintf(f, "\t</svg:svg>\n");
    fprintf(f, "\t<!-- ... -->\n");
    fprintf(f, "</parent>");
    fclose(f);
}

int main(void)
{
    char* filename = "/Users/stephenlavelle/Documents/Ortho/tools/dat/bin/9.bin";
    char* fileout = "/Users/stephenlavelle/Documents/Ortho/tools/dat/svg/9.svg";
    
    printf("creating %s\n",fileout);

    struct Page* page = loadPage(filename);
    printPage(page);
    
    printSVG(page,fileout);
    
    freePage(page);
    
    return 0;
}
