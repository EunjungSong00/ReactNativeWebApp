export default `
<div>
<form name="niceForm">
<input type="hidden" name="m" value="checkplusService" />
<input type="hidden" name="EncodeData" value="<%EncodeData%>" />
</form>
</div>
<script>
document.niceForm.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
document.niceForm.submit();
</script>
`