$(document).ready(function () {
    new EmployeePage();
    dropdownOnClick();
})

class EmployeePage extends Base{

    listName;

    // //Các dropdown trên trang chủ
    // //dropdown chọn nhà hàng
    // static dropdownRestaurant = new Dropdown('#dropdown__restaurant');
    // //dropdown phòng ban ở trang chủ
    // static dropdownRoom = new Dropdown('#dropdown__room');
    // //dropdown vị trí ở trang chủ
    // static dropdownRole = new Dropdown('#dropdown__role');

    // //Các dropdown trên modal
    // //dropdown giới tính
    // static modalSex = new Dropdown('#dropdown__sex');
    // //dropdown vị trị ở modal
    // static modalRole = new Dropdown('#dropdown__modal-role');
    // //dropdown phòng ban ở modal
    // static modalWorkPlace = new Dropdown('#dropdown__work-place');
    // //dropdown trạng thái làm việc
    // static modalWorkStatus = new Dropdown('#dropdown__work-status');

    constructor(){
        super('#tblListDataEmployee','EmployeeId');

        this.initEvents();
        this.validateAll();
    }

    /**
     * Hàm xử lý sự kiện trong trang employee
     * CreatedBy: PHDUONG(28/07/2021)
     */
    initEvents = () =>{
        const self = this;

        //Xử lý sự kiện nhấn nút refresh thì load lại data trong bảng
        Variables.buttonReload.click(() => self.loadData());

        //Sự kiện nhấn nút Lưu
        Variables.submitBtn.click(() => self.storeEmployeeOnClick(this));

        //Sự kiện định dạng ô nhập lương khi gõ
        Variables.inputSalary.on('change click keyup input paste', function(event) {
            DataFormatter.formatInput(this,'salary');
        });

        //Sự kiện định dạng ô mã số thuế khi gõ
        Variables.inputPersonalTaxCode.on('change click keyup input paste', function(event) {
            DataFormatter.formatInput(this,'');
        });

        //Sự kiện định dạng ô IdentityNumber khi gõ
        Variables.inputIdentityNumber.on('change click keyup input paste', function(event) {
            DataFormatter.formatInput(this,'');
        });

        //Sự kiện Mở modal với thông tin nhân viên khi double click
        Variables.employeesTable.on('dblclick', 'tbody tr', function(){
            const self = this;

            EmployeePage.createNewEmployee = false;

            Base.openModal();

            Variables.employeeId = $(self).attr('data');
            // debugger
           try {
               $.ajax({
                   url: Variables.employeesApi+'/'+Variables.employeeId,
                   method: "GET",
               }).done(function (res){
                    EmployeePage.bindingDataToModal(res);

               })
           } catch (error) {
                console.log(error);
           }
        })

        //Sự kiện click cho nút xóa, thực hiện kiểm tra các tr có checkbox active để xóa
        Variables.alertDeleteBtn.click(() => {
            const checkboxes = $('tbody tr .delete-box input');
            checkboxes.each((index, box) => {
                if (box.getAttribute('checked') === 'checked') {

                    const employeeIdToDelete = $(box).parent().parent().parent().attr('data');
                    self.deleteEmployee(employeeIdToDelete);
                }
            })
            self.loadData();
        });
    }

    /**
     * Hàm xóa nhân viên
     * @param {*} id id của nhân viên
     */
    deleteEmployee = (id) => {
        try {
            $.ajax({
                url: `${Variables.employeesApi}/${id}`,
                method: 'DELETE',
            }).done(function () {
                //xóa thành công thì ẩn cảnh báo
                Variables.alertMessage.css('display', 'none');
                //xóa thành công thì ẩn nút xóa
                Variables.buttonDelete.css('display', 'none');
            }).fail(function (res) {
                console.log("Xóa thất bại");
            })
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Đưa dữ liệu lấy được từ EmployeeId lên modal
     * @param {*} data 
     * CreatedBy: PHDUONG(28/07/2021)
     */
    static bindingDataToModal = (data) =>{
        Variables.inputEmployeeCode.val(data["EmployeeCode"]);
        Variables.inputFullName.val(data["FullName"]);
        Variables.inputDateOfBirth.val(DataFormatter.formatDate(data["DateOfBirth"],true));
        Variables.inputGenderName.text(data["GenderName"] ? data["GenderName"] : "Chọn giới tính" );
        Variables.inputIdentityNumber.val(data["IdentityNumber"]);
        Variables.inputIdentityDate.val(DataFormatter.formatDate(data["IdentityDate"],true));
        Variables.inputIdentityPlace.val(data["IdentityPlace"]);
        Variables.inputEmail.val(data["Email"]);
        Variables.inputPhoneNumber.val(data["PhoneNumber"]);
        Variables.inputPositionName.text(data["PositionName"] ? data["PositionName"] : "Tất cả vị trí");
        Variables.inputDepartmentName.text(data["DepartmentName"] ? data["DepartmentName"] : "Tất cả phòng ban");
        Variables.inputPersonalTaxCode.val(data["PersonalTaxCode"]);
        Variables.inputSalary.val(DataFormatter.formatMoney(data["Salary"]));
        Variables.inputJoinDate.val(DataFormatter.formatDate(data["JoinDate"],true));
        Variables.inputWorkStatus.text(DataFormatter.formatWorkStatus(data["WorkStatus"]));
    }

    /**
     * Lưu dữ liệu tạo mới employee
     * @param {*} self 
     * CreatedBy: PHDUONG(28/07/2021)
     */
    storeEmployeeOnClick(self) {
        let employee = {};

        employee.EmployeeCode = Variables.inputEmployeeCode.val();
        employee.FullName = Variables.inputFullName.val();
        employee.DateOfBirth = Variables.inputDateOfBirth.val();
        employee.Gender = $('#gender').attr('value');
        employee.GenderName =  Variables.inputGenderName.text()  ;
        employee.IdentityNumber = Variables.inputIdentityNumber.val();
        employee.IdentityDate = Variables.inputIdentityDate.val();
        employee.IddentityPlace = Variables.inputIdentityPlace.val();
        employee.Email = Variables.inputEmail.val();
        employee.PhoneNumber = Variables.inputPhoneNumber.val();
        employee.PositionId = $('#txtPosition').attr('value');
        employee.PositionName = Variables.inputPositionName.text();
        employee.DepartmentId = $('#txtDepartment').attr('value');
        employee.DepartmentName = Variables.inputDepartmentName.text();
        employee.PersonalTaxCode = Variables.inputPersonalTaxCode.val();
        employee.Salary = DataFormatter.formatMoney( Variables.inputSalary.val());
        employee.JoinDate = Variables.inputJoinDate.val();
        employee.WorkStatus = $('#txtWorkStatus').attr('value');

        try {
             $.ajax({
            url: Base.createNewEmployee ? Variables.employeesApi: `${Variables.employeesApi}/$(Variables.employeeId)`,
            method: Base.createNewEmployee ? "POST" : "PUT",
            data: JSON.stringify(employee),
            dataType: 'json',
            contentType: 'application/json',
            success: function(result) {
                
                debugger;
                Base.closeModal();
                self.loadData();
                alert("Thêm thành công");
            }
        });
        } catch (error) {
            console.log(error);
        }
       
    }

    /**
     * Hàm kiểm tra ô nhập trống
     * @returns 
     * CreatedBy: PHDUONG(28/07/2021)
     */
    validateRequired = () => {
        const self = this;
        const required = $('input[required]');
        // if (required.val().trim() === '') return false;
        required.blur(function () {
            if ($(this).val().trim() === '') {
                $(this).addClass('input--alert');
                // $(this).attr('title', 'Thông tin này bắt buộc nhập!');
                // debugger
                self.showError($(this), 'Thông tin này bắt buộc nhập');
                return false;
            } else {
                $(this).removeClass('input--alert');
                $(this).removeAttr('title');
            }
        })

        required.on('input click', function () {
            $("div").remove('.float--alert')
        })
        return true;
    }

    /**
     * Kiểm tra định dạng email
     * @returns boolean
     * CreatedBy: PHDUONG(28/07/2021)
     */
    validateEmail = () => {
        const self = this;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        Variables.inputEmail.on('blur', function() {
            const email = Variables.inputEmail.val();
            if (email == '') {
                self.showError($(this), 'Thông tin này bắt buộc nhập');
            }else if (!re.test(String(email).toLowerCase())) {
                self.showError(Variables.inputEmail, 'Email không đúng định dạng');
                return false;
                }
        })
        return true;
    }
    
    /**
     * Hàm hiện thông báo lỗi khi nhập sai input
     * @param {*} input ô nhập 
     * @param {*} msg text thông báo cần hiện
     * CreatedBy: PHDUONG(28/07/2021)
     */
    showError = (input, msg) => {
        // debugger
        const errorBubble = `<div class="float--alert">${msg}</div>`;
        input.parent().append(errorBubble);
    }

    /**
     * Hàm validate tổng thế trước khi submit data
     * @returns 
     * CreatedBy: PHDUONG(28/07/2021)
     */
    validateAll = () => {
        // debugger
        return this.validateRequired() && this.validateEmail();
    }
    //#endregion
}



/**
 * Ẩn hiện dropdown và combobox khi click
 * CreatedBy: PHDUONG (23/7/2021)
 */
 function dropdownOnClick() {



    var dropBtn = "";
    var dropContent = "";
    var dropSpan = "";

    $(".dropdown__button").on("click", function() {
        $(".dropdown__button").next().hide(); //đóng tất cả những dropdown đang mở
        $(this).next().show(); //mở dropdown được lựa chọn
        dropBtn = $(this)[0]; //lưu lại dom của dropdown được chọn
        dropContent = ($(this).next())[0]; //lưu lại dom của Content của dropdown được chọn
        dropSpan = $(this).children()[0]; //lưu lại dom của text span của dropdown được chọn
    })
    
    var comboboxInput ="";
    var comboboxBtn = "";
    var comboboxOtion = "";
    var comboboxBtnIcon = "";

    $(".combobox__input").on("click", function() {
            $(".combobox__input").next().next().hide(); //đóng tất cả những combobox đang mở
            $(this).next().next().show(); //mở combobox được lựa chọn
            comboboxInput = $(this)[0]; //lưu lại dom của combobox input được chọn
            comboboxBtn = ($(this).next())[0]; //lưu lại dom của combobox được chọn
            comboboxBtnIcon = ($(this).next().children())[0]; //lưu lại dom của combobox được chọn
            comboboxOtion = ($(this).next().next())[0]; //lưu lại dom của option của combobox được chọn
            // comboboxSpan = $(this).children()[0]; //lưu lại dom của text span của combobox được chọn
        })
        $(".combobox__button").on("click", function() {
            // debugger
            if($(this)[0]!=comboboxBtn){
                $(".combobox__button").next().hide(); //đóng tất cả những combobox đang mở
                // debugger
                $(this).next().show(); //mở combobox được lựa chọn
                comboboxInput = ($(this).prev())[0]; //lưu lại dom của combobox input được chọn
                comboboxBtn = $(this)[0]; //lưu lại dom của combobox btn được chọn
                comboboxBtnIcon = ($(this).children())[0]; //lưu lại dom của combobox btn icon được chọn
                comboboxOtion = ($(this).next())[0]; //lưu lại dom của option của combobox được chọn
                // comboboxSpan = $(this).children()[0]; //lưu lại dom của text span của combobox được chọn
            }
            
        })
    window.onclick = function(event) {
        // debugger
        if (event.target != dropBtn && event.target != dropContent && event.target != dropSpan) { //đóng dropdown khi click vào những đối tượng khác 
            if (event.target.getAttribute('value') == null) { //đóng dropdown khi click vào những đối tượng ko có value
                if (dropContent)
                    $(".dropdown__button").next().hide(); //đóng tất cả dropdown
            } else {
                // debugger
                if (event.target.parentNode.getAttribute('class')!="combobox") {
                    if(!event.target.parentNode.previousElementSibling.previousElementSibling){
                        // debugger
                        event.target.parentNode.previousElementSibling.firstElementChild.textContent = event.target.innerText; //thay tên của button bằng tên của option đang được chọn
                        // event.target.parentNode.previousElementSibling.firstElementChild.setAttribute("value", event.target.getAttribute('value')); ////thay value của button bằng value của option đang được chọn
                        event.target.parentNode.parentNode.parentNode.setAttribute("value",event.target.getAttribute('value'));
                        // debugger

                        $(".dropdown__button").next().children().css("background-color", "#fff"); //set background của tất cả option
                        $(".dropdown__button").next().children().css("color", "#000"); //set text color của tất cả option
                        event.target.style.background = "#019160"; //set background của option đang được chọn
                        event.target.style.color = "#fff"; //set text color của option đang được chọn

                        setTimeout(() => {  event.target.parentNode.style.display = "none"; }, 1000);
                        return 1;
                }
                }
                
                
            }
        }
        if (event.target != comboboxInput && event.target != comboboxBtn && event.target != comboboxOtion && event.target != comboboxBtnIcon) { //đóng dropdown khi click vào những đối tượng khác 
            if (event.target.getAttribute('value') == null) { //đóng dropdown khi click vào những đối tượng ko có value
                if (comboboxOtion)
                    // debugger
                    $(".combobox__input").next().next().hide(); //đóng tất cả dropdown
            } else {
                // debugger
                if(event.target.getAttribute('value') == 0){
                    // debugger
                    // $("table tbody tr").remove();
                    // loadData(); 
                }
                    // event.target.parentNode.previousElementSibling.firstElementChild.textContent = event.target.innerText; //thay tên của button bằng tên của option đang được chọn
                    event.target.parentNode.previousElementSibling.previousElementSibling.setAttribute("value", event.target.innerText); //thay value của input bằng text của option đang được chọn
                    // debugger

                    $(".combobox__input").next().next().children().css("background-color", "#fff"); //set background của tất cả option
                    $(".combobox__input").next().next().children().css("color", "#000"); //set text color của tất cả option
                    event.target.style.background = "#019160"; //set background của option đang được chọn
                    event.target.style.color = "#fff"; //set text color của option đang được chọn
                    setTimeout(() => {  event.target.parentNode.style.display = "none"; }, 1000);
            }
        }
        if (event.target == Variables.popupModal[0]) {
            Variables.popupModal.css("display", "none");
        }
    }
}

