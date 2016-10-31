//fromsvgrender
        case 34: //page
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<path stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s, y - s,
                    "L", x + s, y - s,
                    "L", x + s, y + s,
                    "L", x - s, y + s,
                    "Z",
                    "M", x - s * 0.6, y - s / 2,
                    "L", x + s * 0.6, y - s / 2,
                    "M", x - s * 0.6, y,
                    "L", x + s * 0.6, y,
                    "M", x - s * 0.6, y + s / 2,
                    "L", x + s * 0.6, y + s / 2,
                    "'/>\n"
                ].compileList();
                

                break;
            }


        case 24: //banana peel
            {
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`

                var e = DOC_CELLSIZE * 0.1;
                var r = DOC_CELLSIZE * 0.4;
                var t = DOC_CELLSIZE * 0.4;
                var dy = -DOC_CELLSIZE * 0.1;
                var yc = y - dy;
                y += dy;
                result += [
                    "M", x - e, y - r / 2,
                    "C", x - 2 * e, y + r / 5, x - e / 5, y + r / 5, x - t, y + r,
                    "C", x, y + r, x - e / 5, y + r / 5, x, yc,

                    "C", x + e / 5, y + r / 5, x, y + r, x + t, y + r,
                    "C", x + e / 5, y + r / 5, x + 2 * e, y + r / 5, x + e, y - r / 2,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break;
            }

            
        case 16: //open mouth
            {
                var r = DOC_CELLSIZE * 0.4;
                var top = r * 0.8;
                result += `\t\t<path  stroke-linejoin="round" stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "C", x - r / 2, y - 1.5 * top, x + r / 2, y - 1.5 * top, x + r, y,
                    "C", x + r / 2, y + 1.5 * top, x - r / 2, y + 1.5 * top, x - r, y,
                    "C", x - r / 2, y - top, x + r / 2, y - top, x + r, y,
                    "C", x + r / 2, y + top, x - r / 2, y + top, x - r, y,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break
            }