/// <reference path="JSLib/jquery-1.4.1.js" />

var Message = {

    Prompt: function() {
        var yesNo;
        if (confirm("Do you want to proceed?.")) {
            yesNo = true;
        }
        else {
            yesNo = false;
        }
        return yesNo;
    },

    CustomSuccessMessage:function(msg) {
        $('#lblMessage').attr("class", "");
        $('#lblMessage').attr("class", "success");

        notif({
            msg: msg,
            type: "success",
            position: 'center',
            autohide: false
        });
    },

    CustomErrorMessage: function (msg) {
        $('#lblMessage').attr("class", "");
        $('#lblMessage').attr("class", "err");

        notif({
            msg: msg,
            type: "error",
            position: 'center',
            autohide: false
        });
    },

    Success: function(event) {
        var _save = "Successfully saved.";
        var _update = "Successfully updated.";
        var _delete = "Successfully deleted.";
        var _cancel = "Successfully cancelled";
        var _reject = "Successfully rejected";
        var _add = "Successfully added";

        $('#lblMessage').attr("class", "");
        $('#lblMessage').attr("class", "success");
        if (event == "save") {

            notif({
                msg: _save,
                type: "success",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "add"){
            notif({
                msg: _add,
                type: "success",
                position: 'center',
                autohide: false
            });

        }
        else if (event == "update") {

            notif({
                msg: _update,
                type: "success",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "delete") {
            notif({
                msg: _delete,
                type: "success",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "cancel") {
            notif({
                msg: _cancel,
                type: "success",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "reject") {
            notif({
                msg: _reject,
                type: "success",
                position: 'center',
                autohide: false
            });
        }

    },

    Error: function(event) {
        var _save = "Failed to save.";
        var _update = "Failed to update.";
        var _delete = "Failed to delete.";
        var _print = "Failed to print";
        var _cancel = "Failed to cancel";
        var _reject = "Failed to reject";
        var _select = "Please select a record.";
        var _Office = "Please Select an Office!";
        var _unknown = "Internal server error.";
        var _Id = "Id Must Be of 5 Digits";
        var _ErrorLogin = "Id or password is empty or incorrect!!!";
        var _add = "Failed to add.";

        $('#lblMessage').attr("class", "");
        $('#lblMessage').attr("class", "err");

        if (event == "save") {
            notif({
                msg: _save,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "add") {
            notif({
                msg: _add,
                type: "success",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "update") {
            notif({
                msg: _update,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "delete") {
            notif({
                msg: _delete,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "print") {
            notif({
                msg: _print,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "cancel") {
            notif({
                msg: _cancel,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "reject") {
            notif({
                msg: _reject,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "select") {
            notif({
                msg: _select,
                type: "error",
                position: 'center',
                autohide: false
            });
        }

        else if (event == "unknown") {
            notif({
                msg: _unknown,
                type: "error",
                position: 'center',
                autohide: false
            });
        } else if (event == "Id") {

            notif({
                msg: _Id,
                type: "error",
                position: 'center',
                autohide: false
            });
        } else if (event == "LoginNotFound") {

            notif({
                msg: _ErrorLogin,
                type: "error",
                position: 'center',
                autohide: false
            });
        }

        else if (event == "Office") {

            notif({
                msg: _Office,
                type: "error",
                position: 'center',
                autohide: false
            });
        }

    },
    Warning: function(message) {
        notif({
            msg: message,
            type: "warning",
            position: 'center',
            autohide: false
        });
    },

    CustomSuccess: function (message) {
        notif({
            msg: message,
            type: "success",
            position: 'center',
            autohide: false
        });
    },


    Exception: function (xhr) {
        var msg = JSON.parse(xhr.responseText);
        var message = '';
        switch (msg) {
            case 547:
                message = 'This record is already in use !';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });
                break;
            case 50547:
                message = 'This record is already in use !';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });
                break;
            case 2601:
                message = 'This is already exist !';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });
                break;
            case 2627:
                message = 'This is already exist !';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });
                break;
            case 10054:
                message = 'Network problem. Please communicate with your network administrator !';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });
                break;
            case "SessionTimeOut":
                message = 'Session timeout reload and try again later';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });
                break;
            case "ModelStateFalse":
                message = 'User input or Model state incorrect';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });
                break;
            default:
                message = 'Internal server error !';
                notif({
                    msg: message,
                    type: "error",
                    position: 'center',
                    autohide: false
                });

        }

    },

    Exist: function (message) {
        notif({
            msg: message,
            type: "error",
            position: 'center',
            autohide: false
        });
    },

    ExceptionSuccess: function (event) {
        var _547 = "This record is already in use !";
        var _2601 = "This data already exists! Please try another one.";
        var _2627 = "This data already exists! Please try another one.";
        var _201 = "Failed to update.";
        
        $('#lblMessage').attr("class", "");
        $('#lblMessage').attr("class", "success");
        if (event == "2627") {

            notif({
                msg: _2627,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        else if (event == "547") {
            notif({
                msg: _547,
                type: "error",
                position: 'center',
                autohide: false
            });

        }
        else if (event == "2601") {

            notif({
                msg: _2601,
                type: "error",
                position: 'center',
                autohide: false
            });
        }

        else if (event == "201") {

            notif({
                msg: _201,
                type: "error",
                position: 'center',
                autohide: false
            });
        }
        
    }


}
