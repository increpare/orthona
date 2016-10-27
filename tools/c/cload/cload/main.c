#include<stdio.h>
#include <stdlib.h>

struct Element {
    char x;
    char y;
    unsigned char s;
};

struct Line {
    char x1;
    char y1;
    char x2;
    char y2;
    unsigned char t;
};

struct Page {
    unsigned char E;
    struct Element* elements;
    unsigned char L;
    struct Line* lines;
};

int compare4bytes(const unsigned char* a, const char* b)
{
    return
    a[0] == b[0] &&
    a[1] == b[1] &&
    a[2] == b[2] &&
    a[3] == b[3];
}

void tryReadBytes(FILE* ptr, unsigned char* buffer, int count){
    size_t loadedBytes = fread(buffer,1,count,ptr);
    if (loadedBytes<count){
        printf("Unexpected EOF.\n");
        exit(1);
    }
}

char signch(unsigned char ch){
    short intermed = ch;
    intermed-=0x80;
    if (intermed<-0xff||intermed>0x7F){
        printf("Char out of range. This shouldn't happen.\n");
        exit(5);
    }
    return (char)intermed;
}

void freePage(struct Page* page){
    free(page->elements);
    free(page->lines);
    free(page);
}

struct Page* loadPage(char* fileName)
{
    
    unsigned char buffer[5];
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
    unsigned char VERSION = buffer[0];
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
        e->x = signch(buffer[0]);
        e->y = signch(buffer[1]);
        e->s = buffer[2];
    }
    
    tryReadBytes(ptr,buffer,1);
    
    P->L = buffer[0];
    P->lines = malloc(sizeof(struct Line)*P->L);
    
    for (int i=0;i<P->L;i++){
        tryReadBytes(ptr,buffer,5);
        struct Line* l = &(P->lines[i]);
        l->x1 = signch(buffer[0]);
        l->y1 = signch(buffer[1]);
        l->x2 = signch(buffer[2]);
        l->y2 = signch(buffer[3]);
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

void printSVG(struct Page* page,char* fileOut){
    
}

int main(void)
{
    char* fileName = "/Users/stephenlavelle/Documents/Ortho/tools/dat/bin/1.bin";
    char* fileOut = "/Users/stephenlavelle/Documents/Ortho/tools/dat/svg/1.svg";
    
    printf("loading %s\n",fileName);

    struct Page* page = loadPage(fileName);
    printSVG(page,fileOut);
    freePage(page);
    return 0;
}
