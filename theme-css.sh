#!/bin/bash

for theme in ./css/themes/*
do
	if test -d $theme; then
		base="./css/themes/${theme##*/}"
		them=${theme##*/}
		less="${base}/${them}.less"
		css="${base}/${them}.css"
		tmp="${base}/${them}.tmp"
		
		touch -c $tmp
		rm -f $css
		
		while read line; do
			if [[ "$line" == "@import"* ]]; then
				import=`echo "$line" | sed "s/.*\([\"']\)\(.*\)\1.*/\2/g"`
				cat ${base}/${import} >> $tmp 
			else
				echo "$line" >> $tmp
			fi
		done < $less
		
		lessc $tmp > $css
		rm -f $tmp
	fi
done