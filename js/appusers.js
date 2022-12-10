(function ($) {
    var self = this;
    self.Data = [
        {
            id: 1,
            full_name:"Nguyễn văn thế",
            email:"nguyenvanthe@gmail.com",
            phone_number:"0345801987",
            address:"Hà Nội"
        },
        {
            id: 2,
            full_name:"Nguyễn văn mạnh",
            email:"nguyenvanmanh@gmail.com",
            phone_number:"0345801983",
            address:"Hà Nội"
        }
    ];
    self.IsUpdate = false;    
    self.User = {
        id: null,
        full_name: null,
        password: "",
        email: "",
        address: "",
        phone_number: "",
        role: 0  
    }
    // self.UserSearch = {
    //     name: "",
    //     role: null,
    //     PageIndex: tedu.configs.pageIndex,
    //     PageSize: tedu.configs.pageSize
    // }
    self.lstRole = [];

    self.addSerialNumber = function () {
        var index = 0;
        $("table tbody tr").each(function (index) {
            $(this).find('td:nth-child(1)').html(index + 1);
        });
    };
    self.RenderTableHtml = function (data) {
        var html = "";
        if (data != "" && data.length > 0) {
            var index = 0;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                html += "<tr>";
                html += "<td>" + (++index) + "</td>";
                html += "<td>" + item.full_name + "</td>";
                html += "<td>" + item.email + "</td>";
                html += "<td>" + item.phone_number + "</td>";
                html += "<td>" + (item.role == 1 ? "Khách hàng " :"Quản trị viên") + "</td>";               
                html += "<td style=\"text-align: center;\">" +

                    // (item.status == 0 ? "<button  class=\"btn btn-dark custom-button\" onClick=UpdateStatus(" + item.id + ",1)><i class=\"bi bi-eye\"></i></button>" : "<button  class=\"btn btn-secondary custom-button\" onClick=UpdateStatus(" + item.id + ",0)><i class=\"bi bi-eye-slash\"></i></button>")  +
                    "<button  class=\"btn btn-primary custom-button\" onClick=\"Update(" + item.id +")\"><i  class=\"fa-solid fa-pen-to-square\"></i></button>" +
                    "<button  class=\"btn btn-danger custom-button\" onClick=\"Deleted(" + item.id +")\"><i  class=\"fa-solid fa-trash\"></i></button>" +
                    "</td>";
                
                html += "</tr>";
            }
        }
        else {
            html += "<tr><td colspan=\"10\" style=\"text-align:center\">Không có dữ liệu</td></tr>";
        }
        $("#tblData").html(html);
    };
    self.Update = function (id) {
        if (id != null && id != "") {
            $(".txtPassword").hide();
            $("#titleModal").text("Cập nhật tài khoản");
            $(".btn-submit-format").text("Cập nhật");
            $(".custom-format").attr("disabled", "disabled");
            self.GetById(id, self.RenderHtmlByObject);
            self.User.id = id;
            //self.RenderHtmlByUser(user);
            $('#userModal').modal('show');
            //$(".content-infor").hide();
            //$(".box-content-add").show();

            self.IsUpdate = true;
        }
    }

    self.GetById = function (id, renderCallBack) {
        //self.userData = {};
        if (id != null && id != "") {
            $.ajax({
                url: '/Admin/AppUsers/GetById',
                type: 'GET',
                dataType: 'json',
                data: {
                    id: id
                },
                beforeSend: function () {
                    //Loading('show');
                },
                complete: function () {
                    ////Loading('hiden');
                },
                success: function (response) {
                    if (response.Data != null) {
                        //self.GetImageByProductId(id);
                        renderCallBack(response.Data);
                        self.Id = id;
                        
                    }
                }
            })
        }
    }


    self.WrapPaging = function (recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / tedu.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationUL a').length === 0 || changePageSize === true) {
            $('#paginationUL').empty();
            $('#paginationUL').removeData("twbs-pagination");
            $('#paginationUL').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationUL').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: '<<',
            prev: '<',
            next: '>',
            last: '>>',
            onPageClick: function (event, p) {
                tedu.configs.pageIndex = p;
                setTimeout(callBack(), 200);
            }
        });
    }
    self.Deleted = function (id) {
        if (id != null && id != "") {
            tedu.confirm('Bạn có chắc muốn xóa tài khoản này?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/AppUsers/Delete",
                    data: { id: id },
                    beforeSend: function () {
                        // tedu.start//Loading();
                    },
                    success: function () {
                        tedu.notify('Đã xóa thành công', 'success');
                        //tedu.stop//Loading();
                        //loadData();
                        self.GetDataPaging(true);
                    },
                    error: function () {
                        tedu.notify('Has an error', 'error');
                        tedu.stop//Loading();
                    }
                });
            });
        }
    }

    self.GetDataPaging = function (isPageChanged) {
        var _data = {
            Name: $(".name-search").val() != "" ? $(".name-search").val() : null,
            Code: $(".code-search").val() != "" ? $(".code-search").val() : null,
            PageIndex: tedu.configs.pageIndex,
            PageSize: tedu.configs.pageSize
        };

        self.UserSearch.PageIndex = tedu.configs.pageIndex;
        self.UserSearch.PageSize = tedu.configs.pageSize;

        $.ajax({
            url: '/Admin/AppUsers/GetAllPaging',
            type: 'GET',
            data: self.UserSearch,
            dataType: 'json',
            beforeSend: function () {
                //Loading('show');
            },
            complete: function () {
                //Loading('hiden');
            },
            success: function (response) {
                self.RenderTableHtml(response.data.Results);
                $('#lblTotalRecords').text(response.data.RowCount);
                if (response.data.RowCount != null && response.data.RowCount > 0) {
                    self.WrapPaging(response.data.RowCount, function () {
                        GetDataPaging();
                    }, isPageChanged);
                }

            }
        })

    };
    self.Init = function () {     
        self.RenderPaging();
        // $('body').on('click', '.btn-edit', function () {
        //     $(".user .modal-title").text("Chỉnh sửa thông tin người dùng");
        //     var id = $(this).attr('data-id');
        //     if (id !== null && id !== undefined) {
        //         self.GetUserById(id);
        //         $('#create').modal('show');
        //     }
        // })

        // $('.add-role').click(function () {
        //     $('#AddRole').modal('show');
        // })

        // $('body').on('click', '.btn-delete', function () {
        //     var id = $(this).attr('data-id');
        //     var fullname = $(this).attr('data-fullname');
        //     if (id !== null && id !== '') {
        //         self.confirmUser(fullname, id);
        //     }
        // })
        // $(".add-image").click(function () {
        //     $("#file-input").click();
        // })

        // $('body').on('click', '.btn-role-user', function () {
        //     var id = $(this).attr('data-id');
        //     $("#user_id").val(id);          
        // })

        // $('body').on('click', '.btn-set-role', function () {
        //     var userId = parseInt($("#user_id").val());
        //     $.each($("#lst-role tr"), function (key, item) {
        //         var check = $(item).find('.ckRole').prop('checked');
        //         if (check == true) {
        //             var id = parseInt($(item).find('.ckRole').val());
        //             self.lstRole.push({
        //                 UserId: userId,
        //                 RoleId: id
        //             });
        //         }
        //     })
        //     if (self.lstRole.length > 0) {
        //         self.SaveRoleForUser(self.lstRole, userId);
        //     }

        // })

       
    }

   
    // Set value default
    self.SetValueDefault = function () {
        self.User.Id = null;
        $("#fullname").val("").attr("placeholder", "Nhập tên người dùng");
        $("#mobile").val("").attr("placeholder", "Nhập số điện thoại");
        $("#birthday").val("").attr("placeholder", "Ngày sinh");
        $("#email").val("").attr("placeholder", "Email");
        $("#username").val("").attr("placeholder", "Tên đăng nhập");
        $("#password").val("").attr("placeholder", "Mật khẩu");
        $("#address").val("").attr("placeholder", "Địa chỉ");
        $("#confirm_password").val("").attr("placeholder", "Nhập lại mật khẩu");
        $(".box-avatar").css("display", "none");
    }
       
    self.ValidateUser = function () {        
        jQuery.validator.addMethod("headphone", function (value, element) {
            var vnf_regex = /((032|033|034|035|036|037|038|039|056|058|059|070|076|077|078|079|081|082|083|084|085|086|087|088|089|090|091|092|093|094|096|097|098|099)+([0-9]{7})\b)/g;
            return vnf_regex.test(value);
        });
        jQuery.validator.addMethod("rigidemail", function (value, element) {
            var testemail = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
            return testemail.test(value);
        });        

        $("#form-submit").validate({
            rules:
            {
                full_name: {
                    required: true,
                    minlength: 8,
                    //checkallowedchars: true,
                },
                phone_number: {
                    required: true,
                    headphone: true,
                    minlength: 10,
                    min: 0,
                    maxlength: 10,
                    number: isNaN
                },
                password: {
                    required: true,
                    minlength: 8,
                },
                confirm_password: {
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    rigidemail: true
                },
                role: {
                    required: true
                },
                address: {
                    maxlength:129
                }
            },
            messages:
            {
                full_name: {
                    required: "Họ tên không được để trống",
                    minlength: "Tên tối thiểu 8 kí tự",
                   // checkallowedchars:"Họ tên không chứa số và kí tự đặc biệt"
                },
                phone_number: {
                    required: "Số điện thoại không được để trống",
                    headphone: "Số điện thoại không hợp lệ"
                },
                password: {
                    required: "Mật khẩu không được để trống",
                    minlength: "Mật khẩu tối thiểu 8 kí tự",
                },
                confirm_password: {
                    equalTo: "Mật khẩu không đúng.",
                },
                email: {
                    required: "Email không được để trống",
                    rigidemail: "Email không đúng định dạng",
                },
                role: {
                    required: "Loại tài khoản không được để trống"
                },
                address: {
                    maxlength: "Địa chỉ nhập không được quá 128 kí tự"
                }
            },
            submitHandler: function (form) {   
                var checkAlloweChars = /[\d`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test($("#full_name").val());
                if (checkAlloweChars == true) {
                    $("#full_name-error").show().text("Họ tên không chứa số và kí tự đặc biệt");
                    return;
                }
                self.GetValue();            
                if (self.IsUpdate) {
                    self.UpdateUser(self.User);
                }
                else {                    
                    self.AddUser(self.User);
                }
            }
        });
    }

    self.GetValue = function () {
        self.User.full_name = $("#full_name").val();
        self.User.phone_number = $("#phone_number").val();
        self.User.email = $("#email").val();
        self.User.address = $("#address").val();
        self.User.role = $("#role").val(); 
        self.User.password = $("#password").val();      

    }    
    self.RenderPaging = function(){
        if(self.Data != null && self.Data.length > 0){
            self.RenderTableHtml(self.Data);
        }
    }

    $(document).ready(function () {        
        self.Init();
        // self.GetDataPaging();
        // self.ValidateUser();

        // $(".modal").on("hidden.bs.modal", function () {
        //     $(this).find('form').trigger('reset');
        //     $("form").validate().resetForm();
        //     $("label.error").hide();
        //     $(".error").removeClass("error");
        // });

        // $(".btn-addorupdate").click(function () {
        //     $(".custom-format").removeAttr("disabled");
        //     $("#titleModal").text("Thêm mới tài khoản");
        //     $(".txtPassword").show();
        //     $(".btn-submit-format").text("Thêm mới");
        //     self.IsUpdate = false;
        //     $('#userModal').modal('show');
        // })       

        // $('input.form-search').on('input', function (e) {
        //     self.UserSearch.name = $(this).val();
        //     self.GetDataPaging(true);
        // });
       
    })
})(jQuery);