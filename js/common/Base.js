class Base {

    

    //Biến kiểm tra xem user khi click vào nút lưu là muốn sửa hay thêm mới nhân viên
    static createNewEmployee = true;

    constructor(tableId, objectId) {
        this.TableId = tableId;
        this.ObjectId = objectId;

        this.loadData();
        this.getDepartments();
        this.getPositions();
        this.initEvents();

    }

    /**
     * Lấy dữ liệu Nhân viên
     *  CreatedBy: PHDUONG (23/07/2021)
     */
    loadData = () => {
        const self = this;
        try {
            $('tbody').empty();
            $.ajax({
                url: Variables.employeesApi,
                method: "GET",
            }).done(function (res) {
                // self.listName = res;
                self.renderTable(res);
            }).fail(function (res) {
                alert(res);
            })
        } catch (error) {
            console.log(error);
        }
    }

    //Hàm render dữ liệu bảng nhân viên
    //@params dữ liệu lấy từ hàm loadData
    //CreatedBy: PHDUONG(28/07/2021)
    renderTable = (tableData) => {
        // debugger
        let tableId = this.TableId;
        let objectId = this.ObjectId;
        // debugger
        if (this.TableId == null) {
            console.log('Vui lòng thêm thông tin Id của table để có dữ liệu');
        }
        // console.log(tableData);
        const self = this;

        tableData.forEach(employee => {

            let columns = $(`table${tableId} thead th`)
            // debugger
            let trHTML = $(`<tr data="${employee[objectId]}"></tr>`);
            let tdCheckBox = $(`<td>
                                    <div class="delete-box">
                                        <input type="checkbox">
                                        <span class="checkmark"></span>                    
                                    </div>                            
                                </td>`);

            $.each(columns, function (i, col) {
                // debugger
                let tdHTML = $('<td></td>');
                const formatType = $(this).attr('format');
                const propName = $(this).attr('prop-name');

                let value = employee[propName];
                switch (formatType) {
                    case 'ddmmyyyy':
                        value = DataFormatter.formatDate(value, false);
                        break;
                    case '$':
                        value = DataFormatter.formatMoney(value);
                        break;

                    default:
                        value = self.clearNull(value);
                        break;
                }
                if (!propName) {
                    trHTML.prepend(tdCheckBox);
                } else {
                    tdHTML.append(value);
                    trHTML.append(tdHTML);
                }
            });
            $('tbody').append(trHTML);
        })
    }

    /**
     * Hàm xóa null
     * @param {*} data Dữ liệu đầu vào
     * CreatedBy: PHDUONG (19/07/2021)
     */
    clearNull = (data) => {
        return data ? data : '';
    }

    /**
     * Lấy dữ liệu Phòng ban
     *  CreatedBy: PHDUONG (23/07/2021)
     */
    getDepartments = () => {
        $.ajax({
            url: Variables.getDepartmentsApi, //địa chỉ API
            method: "GET", //phương thức
        }).done(function (res) {
            var data = res;
            $.each(data, function (index, item) {

                var dropdownItem = $(`<div class="dropdown__option" value="${item.DepartmentId}"><i class="fas fa-check"></i>${item.DepartmentName}</div>`);
                var comboboxtem = $(`<div class="combobox__item" value="${item.DepartmentId}"">
                                        <span class="icon" > <i class="fas fa-check"></i></span>${item.DepartmentName}
                                    </div>`);

                $('#txtDepartment .dropdown__content').append(dropdownItem);
                $('.department-name').append(comboboxtem);

                $(`#${item.DepartmentId}`).on("click", function () {
                    console.log(1);
                })
                index++;

            })
        }).fail(function (res) {
            //đưa ra thông báo lỗi cụ thể (tùy theo httpcode - 400, 404.500):
            //thông thường thì:
            //- Mã 400 - BadRequest -lỗi dữ liệu đầu vào từ Cilient
            //- Mã 404 - Địa chỉ URL ko hợp lệ
            // - 500 - lỗi từ phía backend - server 
            alert('Có lỗi xảy ra vui lòng liên hệ MISA');
        })
    }


    /**
     * Lấy dữ liệu Vị trí
     *  CreatedBy: PHDUONG (23/07/2021)
     */
    getPositions = () => {
        $.ajax({
            url: Variables.getPositionsApi, //địa chỉ API
            method: "GET", //phương thức
        }).done(function (res) {
            var data = res;
            $.each(data, function (index, item) {

                var dropdownItem = $(`<div class="dropdown__option" value="${item.PositionId}"><i class="fas fa-check"></i>${item.PositionName}</div>`);
                $('#txtPosition .dropdown__content').append(dropdownItem);
                var comboboxtem = $(`<div class="combobox__item" value="${item.PositionId}"">
                                        <span class="icon" > <i class="fas fa-check"></i></span>${item.PositionName}
                                    </div>`);
                $('.position-name').append(comboboxtem);
                $(`#${item.PositionId}`).on("click", function () {
                    // getEmployeeByPositionId(item.PositionId);
                    console.log(item.PositionId);
                })
                index++;
            })

        }).fail(function (res) {
            //đưa ra thông báo lỗi cụ thể (tùy theo httpcode - 400, 404.500):
            //thông thường thì:
            //- Mã 400 - BadRequest -lỗi dữ liệu đầu vào từ Cilient
            //- Mã 404 - Địa chỉ URL ko hợp lệ
            // - 500 - lỗi từ phía backend - server 
            alert('Có lỗi xảy ra vui lòng liên hệ MISA');
        })
    }

    /**
     * Hàm xử lý sự kiện chung
     * CreatedBy: PHDUONG(28/07/2021)
     */
    initEvents = () => {
        const self = this;

        //Xử lý sự kiện khi click vào các button phần footer phân trang
        Variables.paginationButtons.on('click', function (event) {
            self.paging(this);
        });
        

        //Xử lý sự kiện click vào các item trên menu
        Variables.menuItems.click(function () {
            Variables.menuItems.removeClass('menu__item--active');
            $(this).addClass('menu__item--active');
        })

        //Thu gọn menu khi nhấn toggle
        Variables.menuToggle.click(() => this.toggleMenu());

        //Dãn input theo placeholder
        Variables.textBox.attr('size', Variables.textBox.attr('placeholder').length);

        //Mở modal khi ấn thêm nhân viên
        Variables.buttonAddEmployee.click(() => Base.openModal());

        //Đóng modal khi ấn dấu x
        Variables.popupModalCloseBtn.click(() => Base.closeModal());

        //Đóng modal khi ấn hủy
        Variables.cancelBtn.click(() => Base.closeModal());

        //Sự kiện nhấn nút Hủy sẽ thoát popup alert
        Variables.alertCancelBtn.click(() => this.closePopupAlert());

        //Sự kiện nhấn dấu x sẽ thoát popup alert
        Variables.alertCloseBtn.click(() => this.closePopupAlert());

        //Sự kiện hiển thị checkmark khi ấn vào từng hàng
        Variables.employeesTable.on('click', 'tbody tr', function () {
            self.rowActive(this);
        })

        //Hiển thị popup xóa nhân viên khi nhấn button xóa nhân viên
        Variables.buttonDelete.click(() => this.openPopupAlert());

        //Sự kiện định dạng ô PhoneNumber khi gõ
        Variables.inputPhoneNumber.on('change click keyup input paste', function(event) {
            DataFormatter.formatInput(this,'');
        });
    }

    /**
     * Hàm kích hoạt checkbox của từng hàng
     * @param {*} self 
     * CreatedBy: PHDUONG(28/07/2021)
     */
    rowActive = (self) => {
        //chọn một lượt tất cả check box để duyệt mảng
        const deleteBoxes = document.querySelectorAll('.delete-box input');
        //chọn một hàng cụ thể
        const row = $(self).children()[0];
        //chọn checkbox từ hàng đó
        const checkbox = $(row).children().children()[0];
        // debugger
        $(checkbox).attr('checked', !$(checkbox).attr('checked'));

        let allUnchecked = true;
        deleteBoxes.forEach(box => {
            if (box.getAttribute('checked') === 'checked') {
                allUnchecked = false;
                Variables.buttonDelete.css('display', 'flex');
            }
            if (allUnchecked) {
                Variables.buttonDelete.css('display', 'none');
            }
        })
    }

    /**
     * Hàm hiện Modal
     * CreatedBy: PHDUONG(28/07/2021)
     */
    static openModal = () => {
        Variables.popupModalInputs.val(null);

        Variables.popupModalInputs.removeClass('input--alert');
        $('div').remove('.float--alert');

        Variables.popupModal.css("display", "block")
    }

    /**
     * Hàm ẩn Modal
     * CreatedBy: PHDUONG(28/07/2021)
     */
    static closeModal = () => {
        Variables.popupModal.css("display", "none");
        Base.createNewEmployee = true;
    }
     /**
     * Hàm mở thông báo xác nhận xóa
     * CreatedBy: PHDUONG(28/07/2021)
     */
    openPopupAlert = () => {
        Variables.alertMessage.css('display', 'flex');
    }

     /**
     * Hàm đóng thông báo xác nhận xóa
     * CreatedBy: PHDUONG(28/07/2021)
     */
    closePopupAlert = () => {
        Variables.alertMessage.css('display', 'none');
    }

    /**
     * Hàm xử lý Paging
     * @param {*} self
     * CreatedBy: PHDUONG(28/07/2021)
     */
    paging = (self) => {
        Variables.paginationButtons.removeClass('active');
        $(self).toggleClass('active');
    }

}