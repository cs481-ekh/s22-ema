'use strict';
$(document).ready(function () {
    setTimeout(function () {

        // [ Donut-chart ] Start
        let graph = Morris.Donut({
            element: 'morris-donut-chart',
            data: [{
                value: 60,
                label: 'Data 1'
            },
                {
                    value: 20,
                    label: 'Data 1'
                },
                {
                    value: 10,
                    label: 'Data 1'
                },
                {
                    value: 5,
                    label: 'Data 1'
                }
            ],
            colors: [
                '#1de9b6',
                '#A389D4',
                '#04a9f5',
                '#1dc4e9',
            ],
            resize: true,
            formatter: function (x) {
                return "val : " + x
            }
        });
        // [ Donut-chart ] end
    }, 700);
});
