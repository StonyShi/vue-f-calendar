### 1.head引用
```
    <link rel="stylesheet" href="../src/vue-f-calendar.css">
    <script type="text/javascript" src="../src/vue.js"></script>
    <script type="text/javascript" src="../src/vue-f-calendar.js"></script>
```

### 2.body使用
```
    <div id="app">
        <div class="container">
            <f-calendar :events="fcEvents"></f-calendar>
        </div>
    </div>
    <script>
        new Vue({
            el: '#app',
            data () {
                return {
                    self: this,
                    visible: false,
                    spinShow: false,
                    fcEvents: this.mockEventData()
                }
            },
            methods: {
                mockEventData (){
                    return [{
                        "title": "刷牙",
                        "start": "2017-03-01 08:30:00",
                        "end": "2017-03-01 08:40:00",
                        "startDate": 1488328200000,
                        "endDate": 1488328800000
                    }, {
                        "title": "吃饭",
                        "start": "2017-03-01 09:00:00",
                        "end": "2017-03-01 09:15:00",
                        "startDate": 1488330000000,
                        "endDate": 1488330900000
                    }, {
                        "title": "跑步",
                        "start": "2017-03-01 18:00:00",
                        "end": "2017-03-01 19:00:00",
                        "startDate": 1488362400000,
                        "endDate": 1488366000000
                    }, {
                        "title": "吃饭",
                        "start": "2017-04-01 12:00:00",
                        "end": "2017-04-01 12:45:00",
                        "startDate": 1491019200000,
                        "endDate": 1491021900000
                    }, {
                        "title": "跑步",
                        "start": "2017-04-01 18:00:00",
                        "end": "2017-04-01 19:00:00",
                        "startDate": 1491040800000,
                        "endDate": 1491044400000
                    }, {
                        "title": "爬山",
                        "start": "2017-05-01 09:00:00",
                        "end": "2017-05-01 11:00:00",
                        "startDate": 1493600400000,
                        "endDate": 1493607600000
                    }, {
                        "title": "SPA",
                        "start": "2017-05-01 18:00:00",
                        "end": "2017-04-01 19:00:00",
                        "startDate": 1493632800000,
                        "endDate": 1491044400000
                    }]
                }
            }
        })
    </script>
```

### 效果

![今天](today.png)

![列表](list.png)