$(document).ready(function () {
    $("#userInfo").hide();

    // Обработчик события клика на кнопке User
    $("#userButton").click(function () {
        $("#adminPanel").hide();
        $("#addNewUser").hide();
        $("#userInfo").show();
    });

    // Обработчик события клика на кнопке Admin
    $("#adminButton").click(function () {
        $("#userInfo").hide();
        $("#adminPanel").show();
        $("#userTableButton").click();
    });

    // Обработчик события клика на кнопке New User
    $("#newUserButton").click(function () {
        $("#adminPanel2").hide();
        $("#addNewUser").show();
        $("#adminPanel").show();
    });

    // Обработчик события клика на кнопке User table
    $("#userTableButton").click(function () {
        $("#addNewUser").hide();
        $("#userInfo").hide();
        $("#adminPanel2").show();
        $("#adminPanel").show();
    });

});