rootURL="http://www.cnntees.com/posts/cartoon-game/"
thumb="thumbs/"
mainimage="mainImages/"
ext=".png"

for i in `seq 1 56`;
do
	fullpath=$rootURL$thumb$i$ext 
	curl -o $thumb$i$ext $fullpath
	fullpath=$rootURL$mainimage$i$ext 
	curl -o $thumb$i$ext $fullpath
done
