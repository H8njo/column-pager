# 1.0.0 (2026-06-06)


### Bug Fixes

* **ColumnPager:** detect non-children prop changes in signature ([dfd048f](https://github.com/H8njo/column-pager/commit/dfd048f228477eebb3b61cd08646c092da8a40b1))
* **ColumnPager:** harden degenerate inputs (columnCount/sliceCount/pageHeight) ([3acc92b](https://github.com/H8njo/column-pager/commit/3acc92bb4a2f9a551ece34ea8fb1cf0de059fe39))
* **ColumnPager:** re-paginate when paginate options change ([4793d07](https://github.com/H8njo/column-pager/commit/4793d07cc78bfb490faf4d0897615af9deb8ffd8))
* **ColumnPager:** render latest child nodes when signature unchanged ([c20af83](https://github.com/H8njo/column-pager/commit/c20af837d0a693e15938ef56ba4c0267b4f5dfa9))
* **ColumnPager:** stop infinite render loop with inline header/footer/callbacks ([796594b](https://github.com/H8njo/column-pager/commit/796594b46e1d463f31b2747f303031772c5c751e))
* **ColumnPager:** unmount React roots on measure throw + drop dead code ([40070bd](https://github.com/H8njo/column-pager/commit/40070bd3ff5a8b946ef4a0e83340d5979cae3179))
* **qa:** hidden ColumnPager never paginated (zero-width measurement) ([155707e](https://github.com/H8njo/column-pager/commit/155707e629fa18dbaef8a711ba0741aa3e97ef6c))
* **storybook:** reserve scrollbar gutter to stop slice double-paint ([0f3187f](https://github.com/H8njo/column-pager/commit/0f3187fa2a9f2d2dbfd062e0d74f3b6736728df7))


### Features

* add ColumnPager as a publishable package ([fba61cb](https://github.com/H8njo/column-pager/commit/fba61cbceb3dad8578bf1286362eca63836dcc85))
* **ColumnPager:** add DOM measurement adapter ([24bae2f](https://github.com/H8njo/column-pager/commit/24bae2ffbed3496418823be78f6cc5a9100289a4))
* **ColumnPager:** add layout components and controls ([d896b60](https://github.com/H8njo/column-pager/commit/d896b6019ffd9d8180deb29dee7943e446a4b912))
* **ColumnPager:** add pure pagination core + tests ([2f52344](https://github.com/H8njo/column-pager/commit/2f52344068dcf81e55bca8dd7b0a999e8ba1389e))
* **ColumnPager:** add query utils + measurement guard ([462ea11](https://github.com/H8njo/column-pager/commit/462ea1197f85bf30b2d91b20166ff178db6ed3c9))
* **ColumnPager:** configurable page size and orientation ([a977ee1](https://github.com/H8njo/column-pager/commit/a977ee1bc119eda3de033e2a6f37916412748034))
* **ColumnPager:** make HTML document options configurable ([f0f3c5d](https://github.com/H8njo/column-pager/commit/f0f3c5d7aa84b6b7ca62b04d97d451113614c54d))
* **ColumnPager:** wire orchestrator, hook, package entry, story ([d4ac221](https://github.com/H8njo/column-pager/commit/d4ac221e3199f7f1dc88f86539aed2a35f751764))


### Performance Improvements

* **ColumnPager:** cache per-item measurements, re-measure only changed blocks ([bbe3b61](https://github.com/H8njo/column-pager/commit/bbe3b611de2e55ea9327997c669db96c44ba8d3e))
* **ColumnPager:** cut measurement/emit latency without losing accuracy ([817837a](https://github.com/H8njo/column-pager/commit/817837a881422ca22baa105ab1a9e3465ccce2fe))
* **ColumnPager:** precompute per-block signature, drop redundant tree walks ([84f61a7](https://github.com/H8njo/column-pager/commit/84f61a73479aa47c3867e519da2e86296b0d67d4))
