(function () {
    // 신규로 구독을 시작한 블로그 목록.
    var addedFollowBlogList = [];

    var TistoryProfile = {
        init : function(info, elem) {
            this.profileInfo = eval(info);
            this.isItem = this.profileInfo.items && this.profileInfo.items.length > 0  ? true : false;
            if (!this.profileWrap) {
                this.fragment = document.createDocumentFragment();
                var pw = this.profileWrap = document.createElement('div');
                var wt = document.createElement('div');
                var wm = this.profileContent = document.createElement('div');
                var wmbw = document.createElement('div');
                var wmiw = this.itemWrap = document.createElement('ul');
                var wb = this.profileMine = document.createElement('div');
                pw.id = 'tistoryProfileLayer';
                wt.className = 'wrapTop';
                wm.className = 'wrapMiddle';
                wmbw.className = 'profileButtonWrap';
                wmiw.className = 'itemWrap';
                wmbw.innerHTML = '<span class="profileClose" onclick="TistoryProfile.close(); return false;"><\/span><span class="div"><\/span><a class="profileHelp" href="http://notice.tistory.com/1542" target="_blank" title="도움말"><\/a>';
                wb.className = this.isItem ? 'wrapBottomM' : 'wrapBottom';
                wm.appendChild(wmbw);
                wm.appendChild(wmiw);
                pw.appendChild(wt);
                pw.appendChild(wm);
                pw.appendChild(wb);
                this.fragment.appendChild(pw);
                this.myProfile('add');
                document.body.appendChild(this.fragment);
            } else {
                this.profileMine.className =  this.isItem ? 'wrapBottomM' : 'wrapBottom';
                this.myProfile();
            }
        },

        escapeHTML : function(s){
            return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')
                .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
                .replace(/'/g,'&#39;');
        },

        getCoords : function(e, elem) {
            var coords = { "left" : 0, "top" : 0, "right" : 0, "bottom" : 0 },
                w = elem.offsetWidth,
                h = elem.offsetHeight;
            if (e.pageX || e.pageY) {
                coords.left = e.pageX;
                coords.top = e.pageY;
            } else if (e.clientX || e.clientY) {
                coords.left = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                coords.top = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            coords.right = coords.left + w;
            coords.bottom = coords.top + h;
            return coords;
        },

        htmlTitle : function(profileInfo) {
            var blogId = parseInt(profileInfo.blogId);
            var html = ''
                + '<span>'
                +   '<a class="title" href="' + profileInfo.url + '" target="_blank" title="' + this.escapeHTML(profileInfo.title) + '">'
                +   this.escapeHTML(profileInfo.title)
                +   '<\/a>'
                + '<\/span>';

            if (profileInfo.isSubscriber === false && addedFollowBlogList.indexOf(blogId) < 0) {
                html = html
                    + '<button class="AddRss" title="구독하기" data-doing="false"'
                    +   ' onclick="TistoryProfile.follow('+ profileInfo.blogId +', $(this), \''+ profileInfo.url +'\', \''+ profileInfo.device +'\');">'
                    + '<\/button>';
            }

            return html;
        },

        follow: function(blogId, $target, url, device) {
            window.followBlog(blogId, $target, url, device)
                .done(function() {
                    addedFollowBlogList.push(blogId);
                    $target.remove();
                });
        },

        myProfile : function(type) {
            if (type == 'add') {
                var infoWrap = document.createElement('div');
                var imgWrap = this.imgWrap = document.createElement('div');
                var title = this.profileName = document.createElement('div');
                var nickname = this.profileTitle = document.createElement('div');
                infoWrap.className = 'profileInfoWrap';
                imgWrap.className = 'profileImageWrap';
                imgWrap.innerHTML = '<img width="35" height="35" src="' +  this.profileInfo.url + '\/plugin\/TistoryProfileLayer_getBlogLogo" alt="" \/>';
                title.className = 'profileTitle';
                nickname.className = 'profileNickname';
                title.innerHTML = this.htmlTitle(this.profileInfo);
                nickname.innerHTML = this.escapeHTML(this.profileInfo.nickname);
                infoWrap.appendChild(title);
                infoWrap.appendChild(nickname);
                this.profileMine.appendChild(imgWrap);
                this.profileMine.appendChild(infoWrap);
            } else {
                this.imgWrap.innerHTML = '<img width="35" height="35" src="' +  this.profileInfo.url + '\/plugin\/TistoryProfileLayer_getBlogLogo" alt="" \/>';
                this.profileName.innerHTML = this.htmlTitle(this.profileInfo);
                this.profileTitle.innerHTML = this.escapeHTML(this.profileInfo.nickname);
            }
        },

        setItems : function() {
            if (this.isItem) {
                var items = this.profileInfo.items;
                this.itemWrap.innerHTML = '';
                for(var i = 0, item; item = items[i]; i++) {
                    var firstItem = i == 0 ? ' first' : '';
                    var itemsString = '';
                    var faviconImg, infoExp, infoExpType, urlType;
                    var itemElem = document.createElement('li');
                    if (item.d == 1) {
                        var serviceInfo = item.info.split(',');
                        var serviceItemType = serviceInfo[0];
                        switch (serviceItemType) {
                            case 'view' :
                                infoExpType = '구독';
                                urlType = 'MyViewFanCount';
                                break;

                            case 'twitter' :
                                infoExpType = 'follower';
                                urlType = 'TwitterFollowCount';
                                break;

                            default:
                                infoExpType = '';
                                urlType = '';
                        }
                        faviconImg = '<img class="favicon" src="\/\/t1.daumcdn.net\/tistory_admin\/static\/profilelayer\/ico_' + serviceItemType + '.gif" alt="favicon" \/>';
                        infoExp = ' <span class="info">(' + infoExpType + ')<\/span>';
                        var tempTitle = item.title;
                        tempTitle = serviceItemType == 'twitter' ? 'twitter' : '';
                    } else {
                        infoExp = '', infoExpType = '', urlType = '';
                        var tempTitle = item.title;
                        faviconImg = item.iconurl ? '<img class="favicon" width="14" height="14" src="' + item.iconurl + '" alt="" \/>' : '';
                    }
                    itemElem.className = 'item' + firstItem;
                    itemsString += '<div class="innerItem" onmouseover="TistoryProfile.itemHover(this, \'over\'); return false;"';
                    itemsString += 'onmouseout="TistoryProfile.itemHover(this, \'out\'); return false;">' + faviconImg + '<a class="itemTitleAnchor" href="' + item.url + '" target="_blank" title="' + this.escapeHTML(tempTitle) + '">' + this.escapeHTML(tempTitle) + '</\a><\/div>';
                    itemElem.innerHTML = itemsString;
                    this.itemWrap.appendChild(itemElem);
                }
            } else {
                this.itemWrap.innerHTML = '';
            }
            this.profileContent.style.height = 'auto';
            this.profileContent.style.height = this.profileContent.offsetHeight + 'px';
        },

        itemHover : function(elem, type) {
            if (type == "over") {
                elem.className = elem.className + ' hover';
            } else {
                elem.className = elem.className.split(' hover').join('');
            }
        },

        show : function(e, elem, info) {
            var e = e ? e : window.event;
            if (this.targetElem && this.targetElem == elem) {
                if (this.profileWrap.style.visibility != 'visible') {
                    var elemCoords = this.getCoords(e, elem);
                    var pw = this.profileWrap;
                    var gap = {h : 10, w : 14};
                    pw.style.left = elemCoords.left - gap.w + 'px';
                    pw.style.top = elemCoords.top - gap.h - pw.offsetHeight + 'px';
                    this.profileWrap.style.visibility = 'visible';
                } else {
                    this.profileWrap.style.visibility = 'hidden';
                }
            } else {
                this.init(info, elem);
                this.targetElem = elem;
                this.setItems();
                var elemCoords = this.getCoords(e, elem);
                var pw = this.profileWrap;
                var gap = {h : 10, w : 14};
                pw.style.left = elemCoords.left - gap.w + 'px';
                pw.style.top = elemCoords.top - gap.h - pw.offsetHeight + 'px';
                pw.style.visibility = 'visible';
            }
        },

        close : function() {
            this.profileWrap.style.visibility = 'hidden';
        }
    };

    window.TistoryProfile = TistoryProfile;

})();
