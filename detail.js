var ATTACH_ACCESS_KEY;
var COMMENT_UNFOLD;
var QUESTION_ID;
var UNINTERESTED_COUNT;
var EDITOR;
var EDITOR_CALLBACK;

$(function()
{
    //闂椤垫坊鍔犺瘎璁�
    AWS.Init.init_comment_box('.aw-add-comment');

	if ($('#c_log_list').attr('id'))
	{
		AWS.load_list_view(G_BASE_URL + '/question/ajax/log/id-' + QUESTION_ID, $('#bp_log_more'), $('#c_log_list'));
	}
	else
	{
		ITEM_IDS = ITEM_IDS.split(',');

		if ($('#wmd-input').length)
		{
			if (G_ADVANCED_EDITOR_ENABLE == 'Y')
			{
				EDITOR = CKEDITOR.replace( 'wmd-input');

				EDITOR_CALLBACK = function (evt)
				{
					if (evt.editor.getData().length)
					{
						$.post(G_BASE_URL + '/account/ajax/save_draft/item_id-' + QUESTION_ID + '__type-' + ANSWER_TYPE, 'message=' + evt.editor.getData(), function (result) {
							$('#answer_content_message').html(result.err + ' <a href="#" onclick="$(\'textarea#advanced_editor\').attr(\'value\', \'\'); AWS.User.delete_draft(QUESTION_ID, ANSWER_TYPE); $(this).parent().html(\' \'); return false;">' + _t('鍒犻櫎鑽夌ǹ') + '</a>');
						}, 'json');
					}
				}

				// 鑷姩淇濆瓨鑽夌ǹ
				EDITOR.on( 'blur', EDITOR_CALLBACK);
			}

		}

		if ($('.aw-upload-box').length)
		{
			if (G_ADVANCED_EDITOR_ENABLE == 'Y')
			{
				var fileupload = new FileUpload('file', '.aw-upload-box .btn', '.aw-upload-box .upload-container', G_BASE_URL + '/publish/ajax/attach_upload/id-' + ANSWER_TYPE + '__attach_access_key-' + ATTACH_ACCESS_KEY, {
					'editor' : EDITOR
				});
			}
			else
			{
				var fileupload = new FileUpload('file', '.aw-upload-box .btn', '.aw-upload-box .upload-container', G_BASE_URL + '/publish/ajax/attach_upload/id-' + ANSWER_TYPE + '__attach_access_key-' + ATTACH_ACCESS_KEY, {
					'editor' : $('.wmd-input')
				});
			}
		}


		//鎶樺彔鍥炲
		$.each($('.aw-question-comment .aw-item'), function (i, e)
		{
			if ($(this).attr('uninterested_count') >= UNINTERESTED_COUNT || $(this).attr('force_fold') == 1)
			{
				$('#uninterested_answers_list').append($(e));
			}
		});

		//鎶樺彔鍥炲鏁伴噺
		if ($('#uninterested_answers_list div.aw-item').length > 0)
		{
			$('#load_uninterested_answers span.hide_answers_count').html($('#uninterested_answers_list div.aw-item').length);
			$('#load_uninterested_answers').fadeIn();
		}

		//鍥炲鎶樺彔鏄剧ず鎸夐挳
	    $('#load_uninterested_answers a').click(function()
	    {
	    	$('#uninterested_answers_list').toggle();
	    });

		//鑷姩灞曞紑璇勮
		if (COMMENT_UNFOLD == 'all')
		{
			$('.aw-add-comment').click();
		}
		else if (COMMENT_UNFOLD == 'question')
		{
			$('.aw-question-detail-meta .aw-add-comment').click();
		}

		//鍥炲楂樹寒
		$.each(ITEM_IDS, function (i, answer_id) {
			if ($('#answer_list_' + answer_id).attr('id'))
			{
				if ($('#answer_list_' + answer_id).find('.aw-add-comment').data('comment-count') > 0)
				{
					$('#answer_list_' + answer_id).find('.aw-add-comment').click();
				}

				AWS.hightlight($('#answer_list_' + answer_id), 'active');
			}
		});
	}

	//鍏虫敞鐢ㄦ埛鍒楄〃
	$.get(G_BASE_URL + '/question/ajax/get_focus_users/question_id-' + QUESTION_ID, function (result) {
		if (result)
		{
			$.each(result, function (i, e) {
				if (e['uid'])
				{
					$('#focus_users').append('<a href="' + e['url'] + '"><img src="' + e['avatar_file'] + '" class="aw-user-name" data-id="' + e['uid'] + '" alt="' + e['user_name'] + '" /></a> ');
				}
				else
				{
					$('#focus_users').append('<a href="javascript:;" title="' + _t('鍖垮悕鐢ㄦ埛') + '"><img src="' + e['avatar_file'] + '" alt="' + _t('鍖垮悕鐢ㄦ埛') + '" /></a> ');
				}
			});
		}
	}, 'json');

    //閭€璇峰洖绛旀寜閽搷浣�
    $('.aw-question-detail .aw-invite-replay').click(function()
    {
    	$('.aw-question-detail .aw-comment-box, .aw-question-detail .aw-question-related-box').hide();
    	if ($('.aw-question-detail .aw-invite-box').is(':visible'))
    	{
    		$('.aw-question-detail .aw-invite-box').fadeOut();
    	}
    	else
    	{
    		$('.aw-question-detail .aw-invite-box').fadeIn();
    	}
    });

    //閭€璇峰垵濮嬪寲
    for (var i = 0; i < 4; i++)
    {
    	$('.aw-question-detail .aw-invite-box ul li').eq(i).show();
    }

    // 閭€璇风炕椤�
    if ($('.aw-question-detail .aw-invite-box .mod-body ul li').length <=4 )
    {
    	//闀垮害灏忎簬4缈婚〉闅愯棌
    	$('.aw-question-detail .aw-invite-box .mod-footer').hide();
    }
    else
    {
    	//閭€璇蜂笂涓€椤�
	    $('.aw-question-detail .aw-invite-box .prev').click(function()
	    {
	    	if (!$(this).hasClass('active'))
	    	{
	    		var flag = 0, list = $('.aw-question-detail .aw-invite-box ul li');

	    		$.each(list, function (i, e)
		    	{
		    		if ($(this).is(':visible') == true)
		    		{
		    			flag = $(this).index();

		    			return false;
		    		}
		    	});

		    	list.hide();

		    	for (var i = 0; i < 4; i++)
	    		{
	    			flag--;

	    			if (flag >= 0)
	    			{
	    				list.eq(flag).show();
	    			}
	    		}
	    		if (flag <= 0)
				{
					$('.aw-question-detail .aw-invite-box .prev').addClass('active');
				}

		    	$('.aw-question-detail .aw-invite-box .next').removeClass('active');
	    	}
	    });

	    //閭€璇蜂笅涓€椤�
	    $('.aw-question-detail .aw-invite-box .next').click(function()
	    {
	    	if (!$(this).hasClass('active'))
	    	{
	    		var flag = 0, list = $('.aw-question-detail .aw-invite-box ul li');

	    		$.each(list, function (i, e)
		    	{
		    		if ($(this).is(':visible') == true)
		    		{
		    			flag = $(this).index();
		    		}
		    	});

	    		list.hide();

	    		for (var i = 0; i < 4; i++)
	    		{
	    			if (flag + 1 <= list.length)
	    			{
	    				flag++;

	    				list.eq(flag).show();

	    				if (flag + 1 == list.length)
	    				{
	    					$('.aw-question-detail .aw-invite-box .next').addClass('active');
	    				}
	    			}
	    		}

		 		$('.aw-question-detail .aw-invite-box .prev').removeClass('active');

	    	}
	    });
    }

    //閭€璇风敤鎴蜂笅鎷夌粦瀹�
    AWS.Dropdown.bind_dropdown_list($('.aw-invite-box #invite-input'), 'invite');

    //閭€璇风敤鎴峰洖绛旂偣鍑讳簨浠�
	$(document).on('click', '.aw-invite-box .aw-dropdown-list a', function () {
	    AWS.User.invite_user($(this),$(this).find('img').attr('src'));
	});

	//鐩稿叧閾炬帴鎸夐挳
	$('.aw-question-detail .aw-add-question-related').click(function()
	{
		$('.aw-question-detail .aw-comment-box, .aw-question-detail .aw-invite-box').hide();
    	if ($('.aw-question-detail .aw-question-related-box').is(':visible'))
    	{
    		$('.aw-question-detail .aw-question-related-box').fadeOut();
    	}
    	else
    	{
    		/*缁欓個璇蜂笁瑙掑舰瀹氫綅*/
    		$('.aw-question-detail .aw-question-related-box .i-dropdown-triangle').css('left', $(this).position().left + 14);
    		$('.aw-question-detail .aw-question-related-box').fadeIn();
    	}
	});

    //鍥炲鍐呭瓒呴摼鎺ユ柊绐楀彛鎵撳紑
    $('.markitup-box a').attr('target','_blank');

});

function one_click_add_topic(selector, topic_title, question_id)
{
	$.post(G_BASE_URL + '/topic/ajax/save_topic_relation/', 'type=question&item_id=' + question_id + '&topic_title=' + topic_title, function (result) {
		if (result.err)
		{
			AWS.alert(result.err);
		}
		else
		{
			$('.aw-topic-bar .tag-bar').prepend('<span class="topic-tag" data-id="' + result.rsm.topic_id + '"><a class="text" href="topic/' + result.rsm.topic_id + '">' + topic_title + '</a></a></span>').hide().fadeIn();

			selector.hide();
		}
	}, 'json');
}