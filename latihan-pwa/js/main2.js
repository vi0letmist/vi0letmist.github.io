$(document).ready(function () {
    //API
    var _url = 'https://my-json-server.typicode.com/vi0letmist/latihan_pwa_api/mahasiswa';
    //var _url = 'http://localhost:8000/index.php';

    //menampung data yg didapat dari API
    var result = '';
    //menampung gender sbg option
    var gender_opt = '';

    //menampung semua gender API
    var gender = [];


    //$.get(_url,function (data)
    function renderPage(data){
        $.each(data,function(key, items){
            //untuk menampung gender sementara pd loop
            _gend = items.gender;
            result+='<div>'+'<p><b>'+items.name+'</b></p>'+
            '<p>'+_gend+'</p>'+'</div>';

            if($.inArray(_gend,gender)=== -1){
                gender.push(_gend);

                gender_opt += '<option value="'+_gend+'">'+_gend+'</option>'
            }
        });
    

        //menggunakan selektor id mhs-list
        //kemudian replace html didalam komponen yang
        //ada di id mhs-list menjadi result
        $('#mhs-list').html(result);

        //menggunakan selektor id gender-select
        //kemudian replace html didalam komponen
        //ada di id gender-select menjadi gender_opt
        $('#gender-select').html('<option value="semua">semua</option>'+gender_opt);

        var networkDataReceive = false;
        //cek di cache, apakah sudah ada apa belum,ngambil data dari service online
        var networkUpdate=fetch(_url).then(function(response){
            return response.json();
        }).then(function(data){
            networkDataReceive = true;
            renderPage(data);
        });

        //fetch data dari cache
        caches.match(_url).then(function(response){
            if(!response) throw Error('no data on cache');
            return response.json();
        }).then(function(data){
            if(!networkDataReceive){
                renderPage(data);
                console.log('render data from cache');
            }
        }).catch(function(){
            return networkUpdate;
        })


        //fliter untuk option
        $('#gender-select').on('change', function(){
            updateList($(this).val());
        });
    }
        function updateList(opt){
            var _url2=_url;
            var result = '';
            if(opt!=='semua'){
                _url2 = _url+'?gender='+opt;
            }
            $.get(_url2,function (data){
                $.each(data,function(key, items){
                    //untuk menampung gender sementara pd loop
                    _gend = items.gender;
                    result+='<div>'+'<p><b>'+items.name+'</b></p>'+
                    '<p>'+_gend+'</p>'+'</div>';
        
                    if($.inArray(_gend,gender)=== -1){
                        gender.push(_gend);
        
                        gender_opt += '<option value="'+_gend+'">'+_gend+'</option>'
                    }

                    
                });
                $('#mhs-list').html(result);
            });
        }

    
});

if ('serviceWorker' in navigator){
    window.addEventListener('load',function(){
        navigator.serviceWorker.register('serviceworker.js').then(function(reg){
            console.log('SW regis sukses dgn skop',reg.scope)
        }, function(err){
            console.log('SW regis failed',err);
        })
    })
}