# 测试环境，shell脚本一键部署

zipFileName='docsDist.zip'

fileName='docsDist'

rm -r -f $fileName

mkdir $fileName

mv $zipFileName $fileName

cd $fileName

unzip -o $zipFileName

rm -f -r $zipFileName

cd ..
