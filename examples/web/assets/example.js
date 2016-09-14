var example = {
    testApi: function(client) {
        example.utils.output('client.Db.getAvailableModels()', client.Db.getAvailableModels());
        if (client.Db.getAvailableModels().length > 0) {
            var model = client.Db.getAvailableModels()[0]

            client.Db[model].all({limit: 100})
                .then((objs) => {
                    var output = 'Returned objects:\n';
                    objs.forEach(function (o) {
                        client.Db[model].getFields().forEach(function(f) {
                            output += f + " = " + o[f] + "; ";
                        });
                        output += "\n";
                    });
                    example.utils.output('client.Db.' + model + '.all({limit: 100})', output);
                })
                .catch((err) => {
                    example.utils.output('client.Db.' + model + '.all({limit: 100})', 'Error: ' + err);
                });
        } else {
            example.utils.status('You don\'t have any model defined', 'warn');
        }
    },
    utils: {
        status: function (msg, level) {
            var s = $('#status');
            if (s.length == 0) {
                s = $('<div id="status"></div>');
                $('body').append(s);
            }
            var color;
            switch (level) {
                case 'info':
                    color = '#009dff';
                    break;
                case 'error':
                    color = '#ff0000';
                    break;
                case 'warn':
                    color = '#ff9100';
                    break;
            }
            s.text(msg).css('color', color);
        },
        output: function (opt, output) {
            var s = $('#outputcontainer');
            if (s.length == 0) {
                s = $('<div id="outputcontainer"></div>');
                $('body').append(s);
            }

            var o = $('<div class="output"><span class="opt">' + opt + '</span><pre>' + output + '</pre></div>');
            s.append(o);
        }
    }
};