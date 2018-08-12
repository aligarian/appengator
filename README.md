	# appengator
	Analysis of app users;
	/* R & D Docs */
	Client
		usersApp
			user_id: String,
		    app_name: String,
		    app_type: String,
		    app_url: String,
		    app_key: {type:String, default:md5(moment().unix())
		    /* info detail */
			Device
				IMEI  	-is exactly, like, not, not like -> input value user's no.
				IMSE 	-is exactly, like, not, not like -> input value
				Model	-is exactly, like, not, not like -> input value
				Android version	-is exactly, like, not, not like -> android version list
				kernel version 	-is exactly, like, not, not like -> kernel version list
				Build no. -is exactly, like, not, not like -> build  version list or input value
				Language  -is exactly, like, not, not like -> list of languages
				Device id -is exactly, like, not, not like
				height -is exactly, like, not, not like -> input value 
				width  -is exactly, like, not, not like -> input value
				timezone -is -> timezone list
				camera pixel -is greater then , less then, equal to -> list
				social media apps -having , not having -> list
			Events
				Event name -clicks counts is greter than , -clicks counts equal to or less then -> input value
			/* end info detail */
			app-users
				app-id
				IMEI
				IMSE
				Model
				Android version
				kernel version
				Build no.
				Language
				Device id
				height
				width
				timezone
				camera pixel
				social media apps	

		#{app_id}-events
			e_name
			e_time: {startAt: xxx, endAt:xxx}
			e_timezone
			e_count

		segments
			app_id
			segment name
			query 
				{collection: segments, document : IMEI, condition : equal to, document_value : 9098},
				{field: timezone} 




