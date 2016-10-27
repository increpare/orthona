#include<stdio.h>
#include <stdlib.h>

struct Element {
    unsigned char x;
    unsigned char y;
    unsigned char s;
};

struct Line {
    unsigned char x1;
    unsigned char y1;
    unsigned char x2;
    unsigned char y2;
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
    size_t loadedBytes = fread(buffer,sizeof(char),count,ptr);
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
    printf("loading %s\n",fileName);
    
    unsigned char buffer[5];
    FILE *ptr;
    
    ptr = fopen(fileName,"rb");
    
    if (ptr==NULL){
        printf("File '%s' not found.\n",fileName);
        exit(1);
    }
    
    size_t loadedBytes = fread(buffer,sizeof(char),4,ptr);
    
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
    printf("\n");
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

int main(int argc, char **argv)
{

    if (argc < 2){
    	printf("usage : cl FILENAME\n");
    	exit(0);
    }

    struct Page* page = loadPage(argv[1]);
    printPage(page);
    
    freePage(page);
    return 0;
}