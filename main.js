(function () {
    /*let comments = {
        'commentID1': {
            threadID: 'thread1',
            commentBy: {
                name: 'Vikas Verma',
                handle: 'audrey1',
                avatar: ''
            },
            timeStamp: '1532873210544',
            likes: 4,
            dislikes: 2,
            content: 'This is my first comment.'
        },
        'commentID2': {
            threadID: 'thread1',
            commentBy: {
                name: 'Kabya',
                handle: 'audrey2',
                avatar: ''
            },
            timeStamp: '1532873210544',
            likes: 4,
            dislikes: 1,
            content: 'This is my first comment.'
        },
        'commentID3': {
            threadID: 'thread1',
            commentBy: {
                name: 'Shailendra',
                handle: 'audrey3',
                avatar: ''
            },
            timeStamp: '1532873210544',
            likes: 1,
            dislikes: 1,
            content: 'This is my first comment.'
        },
        'commentID4': {
            threadID: 'thread1',
            commentBy: {
                name: 'Soumya',
                handle: 'audrey4',
                avatar: ''
            },
            timeStamp: '1532873210544',
            likes: 1,
            dislikes: 1,
            content: 'This is my first comment.'
        },
        'commentID5': {
            threadID: 'thread1',
            commentBy: {
                name: 'Soumya',
                handle: 'audrey5',
                avatar: ''
            },
            timeStamp: '1532873210544',
            likes: 1,
            dislikes: 1,
            content: 'This is my first comment.'
        }
    };

    let commentsThread1 = {
        id: 'thread1',
        commentStructure: {
            'commentID1': {
                'commentID2': {
                    'commentID3': {},
                },
                'commentID4': {},
                'commentID5': {},
            }
        }
    };*/

    function Comments(id) {
        this.id = id;
        this.keyLSDataComments = 'dataComments_' + id;
        this.keyLSDataThread = 'dataThread_' + id;

        this.dataComments = JSON.parse(localStorage.getItem(this.keyLSDataComments) || '{}');
        this.dataThread = JSON.parse(localStorage.getItem(this.keyLSDataThread) || JSON.stringify({
            id: id,
            commentStructure: {}
        }));
        this.init = function () {
            this.insertStartCommenting();
            this.insertCommentData();
        }
    }

    Comments.prototype.removeCommentsNode = function () {
        const elem = document.getElementById(this.id).getElementsByClassName('data-comments')[0];
        elem.parentNode.removeChild(elem);
    };

    Comments.prototype.updateLS = function () {
        localStorage.setItem(this.keyLSDataComments, JSON.stringify(this.dataComments));
        localStorage.setItem(this.keyLSDataThread, JSON.stringify(this.dataThread));
    };

    Comments.prototype.insertCommentBox = function (locator) {
        const scope = this;
        const inputName = document.createElement('input');
        const inputUsername = document.createElement('input');
        const submitCommentBtn = document.createElement('button');
        const inputCommentBoxActions = document.createElement('div');
        const inputComment = document.createElement('div');
        const userAvatar = document.createElement('div');
        const inputCommentBox = document.createElement('div');

        inputName.type = 'text';
        inputName.className = 'form-control';
        inputName.placeholder = 'Name';

        inputUsername.type = 'text';
        inputUsername.className = 'form-control';
        inputUsername.placeholder = 'Username';

        submitCommentBtn.type = 'button';
        submitCommentBtn.className = 'btn btn-default js-submit';
        submitCommentBtn.innerText = 'Submit';

        inputCommentBoxActions.className = 'input-comment-box-actions';

        inputComment.className = 'input-comment';
        inputComment.contentEditable = 'true';

        userAvatar.className = 'user-avatar';

        inputCommentBox.className = 'input-comment-box';
        inputCommentBox.dataset.commentLocator = locator.join('.');
        inputCommentBox.addEventListener('click', function (e) {
            const locator = e.currentTarget.dataset.commentLocator || '';
            const locatorArr = locator.length ? locator.split('.') : [];
            let inputValue = e.currentTarget.children[1].innerHTML;
            let nameValue = e.currentTarget.children[2].children[0].value;
            let usernameValue = e.currentTarget.children[2].children[1].value;

            if (e.target.className.indexOf('js-submit') !== -1) {
                if (inputValue !== '' && nameValue !== '' && usernameValue !== '') {
                    const timeStamp = new Date().getTime();
                    const commentId = 'commentID' + timeStamp;
                    let locObj = scope.dataThread.commentStructure;
                    scope.dataComments[commentId] = {
                        threadID: 'thread' + scope.id,
                        commentBy: {
                            name: nameValue,
                            handle: usernameValue,
                            avatar: 'https://developers.google.com/experts/img/user/user-default.png'
                        },
                        timeStamp: timeStamp,
                        likes: 0,
                        dislikes: 0,
                        content: inputValue
                    };
                    if (locatorArr.length > 0) {
                        for (let i = 0; i < locatorArr.length; i += 1) {
                            locObj = locObj[locatorArr[i]]
                        }
                    }
                    locObj[commentId] = {};
                    scope.updateLS();
                    scope.removeCommentsNode();
                    scope.insertCommentData();
                    e.currentTarget.children[1].innerHTML = '';
                    e.currentTarget.children[2].children[0].value = '';
                    e.currentTarget.children[2].children[1].value = '';
                } else {
                    alert('Please fill all the values.')
                }
            }
        });

        inputCommentBoxActions.appendChild(inputName);
        inputCommentBoxActions.appendChild(inputUsername);
        inputCommentBoxActions.appendChild(submitCommentBtn);

        inputCommentBox.appendChild(userAvatar);
        inputCommentBox.appendChild(inputComment);
        inputCommentBox.appendChild(inputCommentBoxActions);

        return inputCommentBox;
    };

    Comments.prototype.insertStartCommenting = function () {
        const threadElem = document.getElementById(this.id);
        const startComments = document.createElement("div");

        startComments.className = 'start-comments';
        startComments.appendChild(this.insertCommentBox([]));
        threadElem.appendChild(startComments);
    };

    Comments.prototype.generateCommentWrapper = function () {
        const scope = this;
        let curCommentStructure = this.dataThread['commentStructure'];
        let locatorArr = [];

        let dataComments = document.createElement("div");
        dataComments.className = 'data-comments';

        const curTimeInSecs = new Date().getTime();

        function getMoments(ts) {
            let timeDifference = curTimeInSecs - parseInt(ts, 10);
            if (timeDifference < 60000) {
                return 'a few seconds ago'
            } else if (60000 <= timeDifference && timeDifference < 3600000) {
                return Math.floor(timeDifference / 60000) + ' minutes ago'
            } else if (3600000 <= timeDifference && timeDifference < 3600000 * 24) {
                return Math.floor(timeDifference / 3600000) + ' hours ago'
            } else {
                return Math.floor(timeDifference / (3600000 * 24)) + ' days ago'
            }
        }

        function isEmpty(obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }

        function appendChildren(tcs, curDataComments) {
            let commentData = {};

            for (let key in tcs) {
                let commentID = key;
                if (scope.dataComments.hasOwnProperty(commentID)) {
                    commentData = scope.dataComments[commentID];
                } else {
                    continue;
                }

                locatorArr.push(commentID);
                const commentChildren = document.createElement('div');
                commentChildren.className = 'comment-children';

                const commentFooterInput = document.createElement('div');
                commentFooterInput.className = 'comment-footer-input';

                const commentFooterActions = document.createElement('div');
                commentFooterActions.className = 'comment-footer-actions';

                const btnUpvote = document.createElement('button');
                btnUpvote.type = 'button';
                btnUpvote.className = 'btn icon ion-md-thumbs-up';
                btnUpvote.innerText = commentData['likes'];
                btnUpvote.dataset.commentId = commentID;
                btnUpvote.addEventListener('click', function (e) {
                    const cID = e.target.dataset.commentId;
                    scope.dataComments[cID]['likes'] += 1;
                    e.target.innerText = scope.dataComments[cID]['likes'];
                    scope.updateLS();
                });

                const btnDownvote = document.createElement('button');
                btnDownvote.type = 'button';
                btnDownvote.className = 'btn icon ion-md-thumbs-down';
                btnDownvote.innerText = commentData['dislikes'];
                btnDownvote.dataset.commentId = commentID;
                btnDownvote.addEventListener('click', function (e) {
                    const cID = e.target.dataset.commentId;
                    scope.dataComments[cID]['dislikes'] += 1;
                    e.target.innerText = scope.dataComments[cID]['dislikes'];
                    scope.updateLS();
                });

                const btnReply = document.createElement('button');
                btnReply.type = 'button';
                btnReply.className = 'btn';
                btnReply.innerText = 'Reply';
                btnReply.addEventListener('click', function (e) {
                    const inputNode = document.getElementsByClassName('comment-footer-input');
                    for (let i = 0; i < inputNode.length; i += 1) {
                        inputNode[i].style.display = 'none';
                    }
                    e.target.parentElement.nextSibling.style.display = 'block';
                });

                const commentFooter = document.createElement('div');
                commentFooter.className = 'comment-footer';

                const commentContent = document.createElement('div');
                commentContent.className = 'comment-content';
                commentContent.innerHTML = commentData['content'];

                const commentHeaderName = document.createElement('div');
                commentHeaderName.className = 'comment-header-name';
                commentHeaderName.innerText = commentData['commentBy']['name'];

                const commentHeaderUsername = document.createElement('div');
                commentHeaderUsername.className = 'comment-header-username';
                commentHeaderUsername.innerText = commentData['commentBy']['handle'];

                const commentHeaderTimestamp = document.createElement('div');
                commentHeaderTimestamp.className = 'comment-header-timestamp';
                commentHeaderTimestamp.innerText = getMoments(commentData['timeStamp']);

                const commentHeader = document.createElement('div');
                commentHeader.className = 'comment-header';

                const userAvatar = document.createElement('div');
                userAvatar.className = 'user-avatar';
                userAvatar.style.backgroundImage = 'url(' + commentData['commentBy']['avatar'] + ')';

                const commentWrapper = document.createElement('div');
                commentWrapper.className = 'comment-wrapper';

                const commentBox = scope.insertCommentBox(locatorArr);

                commentFooterInput.appendChild(commentBox);

                commentFooterActions.appendChild(btnUpvote);
                commentFooterActions.appendChild(btnDownvote);
                commentFooterActions.appendChild(btnReply);

                commentFooter.appendChild(commentFooterActions);
                commentFooter.appendChild(commentFooterInput);

                commentHeader.appendChild(commentHeaderName);
                commentHeader.appendChild(commentHeaderUsername);
                commentHeader.appendChild(commentHeaderTimestamp);

                commentWrapper.appendChild(userAvatar);
                commentWrapper.appendChild(commentHeader);
                commentWrapper.appendChild(commentContent);
                commentWrapper.appendChild(commentFooter);
                commentWrapper.appendChild(commentChildren);

                curDataComments.appendChild(commentWrapper);

                if (tcs[commentID] && !isEmpty(tcs[commentID])) {
                    appendChildren(tcs[commentID], commentChildren);
                }
                locatorArr.pop();
            }
        }

        appendChildren(curCommentStructure, dataComments);

        return dataComments;
    };

    Comments.prototype.insertCommentData = function () {
        const threadElem = document.getElementById(this.id);

        const dataComments = this.generateCommentWrapper();
        threadElem.appendChild(dataComments);
    };

    const commentThread1 = new Comments('thread1');
    commentThread1.init();


    const commentThread2 = new Comments('thread2');
    commentThread2.init();
})();
