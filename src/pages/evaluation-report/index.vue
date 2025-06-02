<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { searchAssessmentReport } from '@/api/user'
import {mockData} from "@/pages/evaluation-report/mock";

const route = useRoute()
const reportData = ref(null)

onMounted(async () => {
  try {
    const phone = route.query.phone as string
    const agentId = route.query.agent_id as string
    const res = await searchAssessmentReport(phone, agentId, '')
    // reportData.value = res.data
    reportData.value = mockData
  }
  catch (error) {
    console.error('Failed to fetch assessment report:', error)
  }
})
</script>

<template>
  <div class="evaluation-report-container">
    <div class="report-header">
      <h1 class="report-title">
        {{ reportData?.basicInform?.agentId || 'null' }}-{{ reportData?.basicInform?.userName || 'null' }}-评估文档
      </h1>
    </div>

    <div class="report-content">
      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>基本信息</h2>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">评估时间</span>
              <span class="info-value">{{ reportData?.basicInform?.orderTime || 'null' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">订单来源</span>
              <span class="info-value">{{ reportData?.basicInform?.orderNo || 'null' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>客户信息</h2>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">客户要求</span>
              <span class="info-value">{{ reportData?.basicInform?.financingMes?.account || 'null' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">大数据级别</span>
              <span class="info-value level-badge level-a">{{ reportData?.bgLeave || 'null' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">征信级别</span>
              <span class="info-value level-badge level-a">{{ reportData?.leave || 'null' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">客户标签</span>
              <span class="info-value tag">{{ reportData?.userLabel || 'null' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>条件概要</h2>
        </div>
        <div class="card-content">
          <div class="condition-summary">
            <div class="summary-item">
              <div class="summary-label">条件汇总：</div>
              <div class="summary-content">深圳商品房・住宅 & 社保36个月（当前24个月） | 企业21个月 | 本人驾照</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">基本属性：</div>
              <div class="summary-content">男 | 38岁 | 湖北/农村(合村组) | 已婚(征信:不显示) | 本科/学信网可查/全日制</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">是否可考察：</div>
              <div class="summary-content">企业主 | <span class="checked-box">☑</span>家里 <span class="checked-box">☑</span>企业</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">配偶配合情况：</div>
              <div class="summary-content">配偶可知情/可共签</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">驾驶证情况：</div>
              <div class="summary-content">本人有驾照</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">大数据情况：</div>
              <div class="summary-content">伽马大数据30分（补充说明：有被告民事已结案，结案时间2023年06月）</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">特别说明：</div>
              <div class="summary-content">
                <span class="checked-box">☑</span>有银行黑/灰名单情况 - 建行； <span class="checked-box">☑</span>近半年有疑似车贷机构查询记录 - 农行；
                <span class="checked-box">☑</span>历史征信(含五年前和已结清)有疑似车贷机构被拒记录 - 工行； <span class="checked-box">☑</span>普通话和粤语都不会； <span class="checked-box">☑</span>不会写字； <span class="checked-box">☑</span>身体有疾病但不明显
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>基本条件</h2>
        </div>
        <div class="card-content">
          <div class="condition-item">
            <div class="condition-number">
              01
            </div>
            <div class="condition-content">
              <div class="condition-title">
                房产情况 (共1套):
              </div>
              <div class="condition-detail">
                深圳商品房・住宅房1（名下18个月；86㎡；共同共有 [占50%与配偶联名]；评500万；按揭350万供18个月；二押金额50万-小额-XXX）
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              02
            </div>
            <div class="condition-content">
              <div class="condition-title">
                车产情况:
              </div>
              <div class="condition-detail">
                车产（二手车 [广州牌 | 32000KM | 评20万]；名下13个月；按揭 [20万供13个月-平安银行]）
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              03
            </div>
            <div class="condition-content">
              <div class="condition-title">
                金融资产:
              </div>
              <div class="condition-detail">
                股票（12个月；当前价值50万）
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              04
            </div>
            <div class="condition-content">
              <div class="condition-title">
                社保|公积金|个税:
              </div>
              <div class="condition-detail">
                社保汇总：连36个月；当前24个月；医疗8333元 | 养老2030元<br>
                社保单位：深圳市XXX
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              05
            </div>
            <div class="condition-content">
              <div class="condition-title">
                企业情况:
              </div>
              <div class="condition-detail">
                企业汇总：注册21个月；法人股东[占50%]；名下14个月；注册资金500万<br>
                企业名称：深圳市XXX<br>
                企业补充：实体，电子，30多个人，200多平
              </div>
            </div>
          </div>

          <div class="condition-item">
            <div class="condition-number">
              06
            </div>
            <div class="condition-content">
              <div class="condition-title">
                流水情况:
              </div>
              <div class="condition-detail">
                平安流水（固代发工资[8000元]固结息大进账[近6个月平均20万，近12个月平均16万]；结息[56元，26元，38元，69元]）
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>征信情况</h2>
        </div>
        <div class="card-content">
          <div class="credit-section">
            <div class="credit-title">
              【征信负债汇总】
            </div>
            <ul class="credit-list">
              <li>
                <span class="credit-label">总负债：</span>
                <span class="credit-value">总30万（不含担保）；余20万；供0.6万（不含担保）；担保10万</span>
              </li>
              <li>
                <span class="credit-label">信用卡：</span>
                <span class="credit-value">总6家；总14.2万；平均6.9万（48.6%）；已用8.9万（62.7%）</span>
              </li>
              <li>
                <span class="credit-label">负债月供：</span>
                <span class="credit-value">1.2万</span>
              </li>
            </ul>
          </div>

          <div class="credit-section">
            <div class="credit-title">
              【征信贷款明细（总2笔）】
            </div>
            <div class="condition-item">
              <div class="condition-number">
                01
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  信用卡小额类（总1笔）：
                </div>
                <div class="condition-detail">
                  20XX-XX XX机构（总_万余_万-递减方式供_个月）
                </div>
              </div>
            </div>
            <div class="condition-item">
              <div class="condition-number">
                02
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  担保类（总1笔）：
                </div>
                <div class="condition-detail">
                  20XX-XX XX机构（为个人/为企业-贷款性质-总_万余_万）
                </div>
              </div>
            </div>
          </div>

          <div class="credit-section">
            <div class="credit-title">
              【征信查询情况】
            </div>
            <div class="condition-item">
              <div class="condition-number">
                01
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  最近1次本人查询：
                </div>
                <div class="condition-detail">
                  2025-03-21
                </div>
              </div>
            </div>
            <div class="condition-item">
              <div class="condition-number">
                02
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  查询汇总（含他人查询）
                </div>
                <div class="condition-detail">
                  近1个月1次；近3个月3次；近6个月5次；近12个月9次；近24个月11次
                </div>
              </div>
            </div>
            <div class="condition-item">
              <div class="condition-number">
                03
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  查询汇总（不含他人查询）
                </div>
                <div class="condition-detail">
                  近1个月1次；近3个月3次；近6个月4次；近12个月8次；近24个月10次
                </div>
              </div>
            </div>
          </div>

          <div class="credit-section">
            <div class="credit-title">
              【征信逾期情况】
            </div>
            <ul class="credit-list">
              <li>
                <span class="credit-label">逾期汇总：</span>
                <span class="credit-value">无当前 | 半年内0次 | 一年内0次 | 两年内1次 | 两年外0次</span>
              </li>
              <li>
                <span class="credit-label">逾期明细：</span>
              </li>
            </ul>
            <div class="condition-item">
              <div class="condition-number">
                01
              </div>
              <div class="condition-content">
                <div class="condition-title">
                  贷记卡（总1次）：
                </div>
                <div class="condition-detail">
                  20XX-XX-XX XX机构逾期级别_金额_元
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="card-header">
          <div class="header-decoration" />
          <h2>特殊情况</h2>
        </div>
        <div class="card-content">
          <div class="special-section">
            <div class="special-item">
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  黑/灰名单情况：
                </div>
                <div class="special-detail">
                  建行黑/灰名单（原因： 2022年用建行洗钱）
                </div>
              </div>
            </div>

            <div class="special-item">
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  疑似年贷机构查询（近半年）：
                </div>
                <div class="special-detail">
                  20XX-XX-XX XX机构-查询原因-目标贷款类别（被拒[原因： _]/批款-放款[放款时间： 20XX-XX-XX]/未放款[原因： _]）
                </div>
              </div>
            </div>

            <div class="special-item">
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  疑似年贷机构被拒（含五年前）：
                </div>
                <div class="special-detail">
                  2008-03 工商银行被拒-装修贷（被拒原因： 虚假资料）
                </div>
              </div>
            </div>

            <div class="special-item">
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  普通话/粤语：
                </div>
                <div class="special-detail">
                  <div class="checkbox-item">
                    <span>普通话和粤语都不会</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="special-item">
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  写字能力：
                </div>
                <div class="special-detail">
                  <div class="checkbox-item">
                    <span>不会写字</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="special-item">
              <div class="special-icon">
                <i class="arrow-icon" />
              </div>
              <div class="special-content">
                <div class="special-title">
                  身体缺陷：
                </div>
                <div class="special-detail">
                  <div class="checkbox-item">
                    <span>身体有疾病但不明显</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.evaluation-report-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.report-header {
  margin-bottom: 30px;
  position: relative;
  text-align: center;
}

.report-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.report-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4776e6, #8e54e9);
  border-radius: 3px;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px rgba(31, 38, 135, 0.15);
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, rgba(71, 118, 230, 0.1), rgba(142, 84, 233, 0.1));
}

.header-decoration {
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #4776e6, #8e54e9);
  margin-right: 12px;
  border-radius: 2px;
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-content {
  padding: 20px 24px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  margin-right: 48px;
  min-width: 200px;
  margin-bottom: 16px;
}

.info-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: bold;
  color: white;
}

.level-a {
  background: linear-gradient(135deg, #43cea2, #185a9d);
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(71, 118, 230, 0.1), rgba(142, 84, 233, 0.1));
  border-radius: 16px;
  border: 1px solid rgba(71, 118, 230, 0.3);
}

.condition-item {
  display: flex;
  margin-bottom: 24px;
  position: relative;
}

.condition-item:last-child {
  margin-bottom: 0;
}

.condition-number {
  font-size: 18px;
  font-weight: 700;
  color: #4776e6;
  margin-right: 16px;
  min-width: 30px;
  display: flex;
  align-items: flex-start;
}

.condition-content {
  flex: 1;
}

.condition-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.condition-detail {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  background: rgba(71, 118, 230, 0.05);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid rgba(71, 118, 230, 0.5);
}

.credit-section {
  margin-bottom: 28px;
}

.credit-section:last-child {
  margin-bottom: 0;
}

.credit-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(71, 118, 230, 0.2);
  position: relative;
}

.credit-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #4776e6, #8e54e9);
}

.credit-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.credit-list li {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}

.credit-label {
  font-weight: 500;
  color: #555;
  min-width: 100px;
  margin-right: 8px;
}

.credit-value {
  color: #333;
  flex: 1;
}

.special-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.special-item {
  display: flex;
  align-items: flex-start;
}

.special-icon {
  margin-right: 12px;
  margin-top: 3px;
}

.arrow-icon {
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 0 6px 10px;
  border-color: transparent transparent transparent #4776e6;
}

.special-content {
  flex: 1;
}

.special-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.special-detail {
  color: #555;
  line-height: 1.6;
  background: rgba(71, 118, 230, 0.05);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid rgba(142, 84, 233, 0.5);
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(71, 118, 230, 0.5);
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
}

.checkbox.checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 6px;
  width: 5px;
  height: 10px;
  border: solid #4776e6;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.condition-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
}

.summary-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
  margin-right: 12px;
}

.summary-content {
  flex: 1;
  color: #555;
  line-height: 1.6;
}

.checked-box {
  display: inline-block;
  color: #4776e6;
  font-weight: bold;
  margin-right: 4px;
}

.condition-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
}

.summary-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
  margin-right: 12px;
}

.summary-content {
  flex: 1;
  color: #555;
  line-height: 1.6;
}

.checked-box {
  display: inline-block;
  color: #4776e6;
  font-weight: bold;
  margin-right: 4px;
}

@media (max-width: 768px) {
  .info-item {
    min-width: 100%;
    margin-right: 0;
  }

  .condition-item {
    flex-direction: column;
  }

  .condition-number {
    margin-bottom: 8px;
  }
}
</style>
