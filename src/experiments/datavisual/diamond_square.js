(function() {

d3.diamondSquare = function() {

		/*public static void main(String[] args)
		{
				double[][] temp = makeTable(50,50,50,50,17);
				DiamondSquare ds = new DiamondSquare(temp);
				//ds.diamond(0, 0, 4);
				ds.dS(0, 0, 16, 15, 0.5, true);
		}*/
	
		var seed = 870691;
		var positiveOnly = false;

    function diamondSquare() {
        seed(System.currentTimeMillis());
    }

    function init(start) {
				var forceStay = (function(){ var i=start.length, arr=[]; while(i--) arr.push([]); return arr })();
        for (var r = 0; r < start.length; r++) {
            for (var c = 0; c < start[0].length; c++) {
                if (start[r][c] != 0) {
                    forceStay[r][c] = true;
                }
            }
        }
    }

    //Creates a table with 4 corners set to argument values
    function makeTable(topLeft, topRight, botLeft, botRight, width) {
        var temp = (function(){ var i=width, arr=[]; while(i--) arr.push([]); return arr })();
        for (var r = 0; r < width; r++) {
            for (var c = 0; c < width; c++) {
                temp[r][c] = 0;
            }
        }
        temp[0][0] = topLeft;
        temp[0][width - 1] = topRight;
        temp[width - 1][0] = botLeft;
        temp[width - 1][width - 1] = botRight;
        return temp;
    }

    function boundMax(t, maxHeight) {
        var forceStay = (function(){ var temp=start.length, arr=[]; while(i--) arr.push([]); return arr })();
        for (var r = 0; r < temp.length; r++) {
            for (var c = 0; c < temp[0].length; c++) {
                if (t[r][c] > maxHeight)
                    temp[r][c] = maxHeight;
                else
                    temp[r][c] = t[r][c];
            }
        }
        return temp;
    }

    /*
     t = {
     3 6 0
     3 0 3
     9 6 0
     }
     normalize(t, 9, 1) -> t = {1/3, 2/3, 0, 1/3, 0, 1/3, 1, 2/3, 0}
     normalize(t, 9, 0) -> t = {0 0 0 ... 0}
     */
    /*public static double[][] normalize(double[][] t, double maxHeight, double newMax) {
        return null;
    }*/

    //Starts the iterative loop over the terrain that modifies it
    //Returns a list of the tables between each diamond-square cycle
    function dS(sX, sY, width, startAmp, ratio, positiveOnly) {
        var origWidth = width;
        this.positiveOnly = positiveOnly;
        while (true) {
            for (var r = sX; r <= terrain.length - 2; r += width) {
                for (var c = sY; c <= terrain[0].length - 2; c += width) {
                    diamond(r, c, width, startAmp);
                }
            }
            if (width > 1) {
                width /= 2;
                startAmp *= ratio;
            } else
                break;
        }
        return terrain;
    }

		var forceStay = (function(){ var temp=start.length, arr=[]; while(i--) arr.push([]); return arr })();

    function diamond(sX, sY, width, startAmp) {
        //System.out.println(random);
        if (!forceStay[sX + width / 2][sY + width / 2])
            terrain[sX + width / 2][sY + width / 2] = (terrain[sX][sY] + terrain[sX + width][sY] + terrain[sX][sY + width] + terrain[sX + width][sY + width]) / 4;
        if (!positiveOnly)
            terrain[sX + width / 2][sY + width / 2] += startAmp * (Math.random() - 0.5) * 2;
        else
            terrain[sX + width / 2][sY + width / 2] += startAmp * Math.random() * 2;
		/*System.out.println(t[sX][sY]);
		System.out.println(t[sX+width][sY]);
		System.out.println(t[sX][sY+width]);
		System.out.println(t[sX+width][sY+width]);
		System.out.println("-------");*/
        //printTable(t);
        //System.out.println("-------");
        if (width > 1) {
            square(sX + width / 2, sY, width, startAmp);
            square(sX, sY + width / 2, width, startAmp);
            square(sX + width, sY + width / 2, width, startAmp);
            square(sX + width / 2, sY + width, width, startAmp);
            //diamond(sX, sY, width/2);
            //diamond(sX + width/2, sY, width/2);
            //diamond(sX, sY + width/2, width/2);
            //diamond(sX + width/2, sY + width/2, width/2);
        }
    }

    function square(sX, sY, width, startAmp) {
        if (forceStay[sX][sY]) return;
        //Cases 1-5
        if (sX - width / 2 < 0)
            terrain[sX][sY] = (terrain[sX][sY - width / 2] + terrain[sX][sY + width / 2] + terrain[sX + width / 2][sY]) / 3;
        else if (sX + width / 2 >= terrain.length)
            terrain[sX][sY] = (terrain[sX][sY - width / 2] + terrain[sX][sY + width / 2] + terrain[sX - width / 2][sY]) / 3;
        else if (sY - width / 2 < 0)
            terrain[sX][sY] = (terrain[sX][sY + width / 2] + terrain[sX + width / 2][sY] + terrain[sX - width / 2][sY]) / 3;
        else if (sY + width / 2 >= terrain.length)
            terrain[sX][sY] = (terrain[sX][sY - width / 2] + terrain[sX + width / 2][sY] + terrain[sX - width / 2][sY]) / 3;
        else
            terrain[sX][sY] = (terrain[sX][sY + width / 2] + terrain[sX][sY - width / 2] + terrain[sX + width / 2][sY] + terrain[sX - width / 2][sY]) / 4;
        if (!positiveOnly)
            terrain[sX][sY] += startAmp * (random.nextDouble() - 0.5) * 2;
        else
            terrain[sX][sY] += startAmp * random.nextDouble() * 2;
    }

    /*public double[][] generate(double[][] begin, double[] args) {
        //seed(870);
        init(begin);
        return generate(args);
    }*/

    function generate(args) {
        return dS(args[0], args[1], args[2], args[3], args[4], true);
    }

}
	
})();