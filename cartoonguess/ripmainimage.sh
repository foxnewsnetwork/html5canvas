rootURL="http://www.cnntees.com/posts/cartoon-game/"
mainimage="mainImages/"
thumb="thumbs/"
ext=".png"

for i in `seq 1 56`;
do
	fullpath=$rootURL$thumb$i$ext
	curl -o $mainimage$i$ext $fullpath
done
