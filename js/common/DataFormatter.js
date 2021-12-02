class DataFormatter{
     

    /**
     * Format dữ liệu ngày sinh sang ngày/tháng/năm
     * @param {*} dob dữ liệu ngày sinh
     * CreatedBy: PHDUONG (19/07/2021)
     */
    static formatDate = (str,onModal) => {
        if (!str) return '';
        if (str.length === 0) return '';
        var date = new Date(str);
        return onModal ?
            `${this.dateNum(date.getFullYear())}-${this.dateNum(date.getMonth() + 1)}-${this.dateNum(date.getDate())}` :
            `${this.dateNum(date.getDate())}/${this.dateNum(date.getMonth() + 1)}/${this.dateNum(date.getFullYear())}`;
    }

    /**
     * Hàm định dạng cụ thể ngày và tháng
     * @param {*} num 1 con số bất kỳ
     * @returns nếu số x có 1 chữ số thì trả về dưới dạng '0x', nếu không thì trả về đúng số đó
     * CreatedBy: PHDUONG(27/07/2021)
     */
    static dateNum = (num) => {
        return num < 10 ? '0' + num : num
    };

    static formatInput = (input,type) =>{
        if (type == 'salary') {
            debugger
            $(input).val(function (index, value) {
                return 'VND ' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            });
        }else{
            $(input).val(function (index, value) {
                return value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "");
            });
        }
        return input;
    }


    /**
     * Định dạng tiền tệ
     * @param {*} salary  Số tiền
     * CreatedBy: PHDUONG (19/07/2021)
     */
    static formatMoney = (salary)=> {
        if (!salary) return '';
        if (salary.length === 0) return '';
        if ($.type(salary) === 'string') {
            return salary.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "");
        }
        var salary = new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(salary);
        return salary;
    }

    /**
     * Định dạng Tình trạng công việc
     * @param {*} workStatus Tình trạng công việc dạng int
     * @returns Tình trạng công việc dạng strinng
     * CreatedBy: PHDUONG (19/07/2021)
     */
    static formatWorkStatus = (workStatus) => {
        if (!workStatus) return '';
        if (workStatus.length === 0) return '';
        var works = ["Đang làm việc", "Đang thử việc", "Đã nghỉ việc", "Đã nghỉ hưu"]
        if (workStatus < 4) { //workStatus 5 6 chưa biết
            return workStatus = works[workStatus];
        }
        return workStatus = '';
    }
}